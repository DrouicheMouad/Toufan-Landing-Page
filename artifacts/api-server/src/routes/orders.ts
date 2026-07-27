import { Router, type IRouter } from "express";
import { BOOK_PRICE, CreateOrderBody, CreateOrderResponse, getDeliveryPrice } from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GUEPEX_BASE = "https://api.guepex.app/v1";
const BOOK_NAME = "تحت راية الطوفان";
const FROM_WILAYA = "Sidi Bel Abbès";
const SELLER_EMAIL = "mouaddrouiche22@gmail.com";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (/^[5-7][0-9]{8}$/.test(digits)) return `0${digits}`;
  if (/^213[5-7][0-9]{8}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^0[5-7][0-9]{8}$/.test(digits)) return digits;
  return digits;
}

function guepexHeaders() {
  return {
    "X-API-ID": process.env.GUEPEX_API_ID ?? "",
    "X-API-TOKEN": process.env.GUEPEX_API_TOKEN ?? "",
    "Content-Type": "application/json",
  };
}

async function sendTelegramNotification(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    logger.warn("Telegram credentials not set, skipping notification");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      const body = await res.text();
      logger.warn({ status: res.status, body }, "Telegram notification failed");
    }
  } catch (err) {
    logger.error({ err }, "Error sending Telegram notification");
  }
}

async function sendEmailNotification(subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set, skipping email notification");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Book Orders <onboarding@resend.dev>",
        to: [SELLER_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      logger.warn({ status: res.status, body }, "Resend email failed");
    }
  } catch (err) {
    logger.error({ err }, "Error sending email notification");
  }
}

// POST /api/orders
router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const body = parsed.data;
  const normalizedPhone = normalizePhone(body.contact_phone);
  const deliveryPrice = getDeliveryPrice(body.to_wilaya_name, body.is_stopdesk);
  const totalPrice = BOOK_PRICE + deliveryPrice;

  const orderId = `book-${Date.now()}`;

  const parcelPayload = [
    {
      order_id: orderId,
      from_wilaya_name: FROM_WILAYA,
      firstname: body.firstname,
      familyname: body.familyname,
      contact_phone: normalizedPhone,
      address: body.address ?? "غير محدد",
      to_wilaya_name: body.to_wilaya_name,
      to_commune_name: body.to_commune_name,
      product_list: BOOK_NAME,
      price: BOOK_PRICE,
      do_insurance: false,
      declared_value: BOOK_PRICE,
      length: 24,
      width: 16,
      height: 3,
      weight: 1,
      freeshipping: false,
      is_stopdesk: body.is_stopdesk,
      stopdesk_id: body.is_stopdesk ? (body.stopdesk_id ?? null) : null,
      has_exchange: false,
    },
  ];

  let tracking: string | null = null;
  let label: string | null = null;
  let success = false;
  let errorMessage: string | null = null;

  try {
    const guepexRes = await fetch(`${GUEPEX_BASE}/parcels/`, {
      method: "POST",
      headers: guepexHeaders(),
      body: JSON.stringify(parcelPayload),
    });

    if (!guepexRes.ok) {
      const errBody = await guepexRes.text();
      req.log.error({ status: guepexRes.status, body: errBody }, "Guepex create parcel error");
      errorMessage = `Guepex error: ${guepexRes.status}`;
    } else {
      const guepexData = await guepexRes.json() as Record<string, { success: boolean; tracking: string | null; label: string | null; message: string }>;
      const result = guepexData[orderId];
      if (result?.success) {
        success = true;
        tracking = result.tracking ?? null;
        label = result.label ?? null;
      } else {
        errorMessage = result?.message ?? "Unknown Guepex error";
        req.log.warn({ result }, "Guepex order not created");
      }
    }
  } catch (err) {
    req.log.error({ err }, "Error calling Guepex API");
    errorMessage = "Failed to reach delivery service";
  }

  try {
    await db.insert(ordersTable).values({
      tracking,
      firstname: body.firstname,
      familyname: body.familyname,
      contact_phone: normalizedPhone,
      to_wilaya_name: body.to_wilaya_name,
      to_commune_name: body.to_commune_name,
      is_stopdesk: body.is_stopdesk,
      stopdesk_id: body.stopdesk_id ?? null,
      address: body.address ?? null,
      delivery_price: deliveryPrice,
      success,
      error_message: errorMessage,
    });
  } catch (dbErr) {
    req.log.error({ err: dbErr }, "Failed to save order to DB");
  }

  const customerName = `${body.firstname} ${body.familyname}`;
  const deliveryType = body.is_stopdesk ? "سحب من مكتب" : "توصيل للباب";
  const notifMessage = success
    ? `📦 طلب جديد!\n\nالعميل: ${customerName}\nالهاتف: ${normalizedPhone}\nالولاية: ${body.to_wilaya_name}\nالبلدية: ${body.to_commune_name}\nالتوصيل: ${deliveryType}\nسعر الكتاب: ${BOOK_PRICE} DA\nسعر التوصيل: ${deliveryPrice} DA\nالمجموع: ${totalPrice} DA\nرقم التتبع: ${tracking}`
    : `⚠️ طلب فاشل!\n\nالعميل: ${customerName}\nالهاتف: ${normalizedPhone}\nالولاية: ${body.to_wilaya_name}\nالخطأ: ${errorMessage}`;

  const emailHtml = success
    ? `<h2>طلب جديد — ${BOOK_NAME}</h2>
       <table border="0" cellpadding="8" style="font-family:sans-serif;font-size:14px">
         <tr><td><b>العميل</b></td><td>${customerName}</td></tr>
         <tr><td><b>الهاتف</b></td><td>${normalizedPhone}</td></tr>
         <tr><td><b>الولاية</b></td><td>${body.to_wilaya_name}</td></tr>
         <tr><td><b>البلدية</b></td><td>${body.to_commune_name}</td></tr>
         <tr><td><b>التوصيل</b></td><td>${deliveryType}</td></tr>
         ${body.address ? `<tr><td><b>العنوان</b></td><td>${body.address}</td></tr>` : ""}
         <tr><td><b>رقم التتبع</b></td><td><b style="color:#2563eb">${tracking}</b></td></tr>
         <tr><td><b>سعر الكتاب</b></td><td>${BOOK_PRICE} DA</td></tr>
         <tr><td><b>سعر التوصيل</b></td><td>${deliveryPrice} DA</td></tr>
         <tr><td><b>المجموع</b></td><td><b style="color:#2563eb">${totalPrice} DA</b></td></tr>
       </table>
       <p style="margin-top:16px"><a href="${label}" style="color:#2563eb">عرض بطاقة التوصيل</a></p>`
    : `<h2>⚠️ طلب فاشل — ${BOOK_NAME}</h2>
       <p>العميل: ${customerName} — ${normalizedPhone}</p>
       <p>الخطأ: ${errorMessage}</p>`;

  Promise.all([
    sendTelegramNotification(notifMessage),
    sendEmailNotification(
      success ? `📦 طلب جديد — ${customerName} — ${body.to_wilaya_name}` : `⚠️ طلب فاشل — ${customerName}`,
      emailHtml
    ),
  ]).catch((err) => logger.error({ err }, "Notification error"));

  res.status(200).json(
    CreateOrderResponse.parse({ success, tracking, label, message: errorMessage })
  );
});

export default router;
