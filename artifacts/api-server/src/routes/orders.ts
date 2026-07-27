import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
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
  // 9 digits starting with 5-7 → add leading 0
  if (/^[5-7][0-9]{8}$/.test(digits)) return `0${digits}`;
  // 12 digits starting with 213 → strip country code and add 0
  if (/^213[5-7][0-9]{8}$/.test(digits)) return `0${digits.slice(3)}`;
  // 10 digits starting with 0 → keep as is
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
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) {
    logger.warn("GMAIL_APP_PASSWORD not set, skipping email notification");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SELLER_EMAIL, pass },
    });
    await transporter.sendMail({
      from: `"Book Orders" <${SELLER_EMAIL}>`,
      to: SELLER_EMAIL,
      subject,
      html,
    });
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

  // Build unique order_id
  const orderId = `book-${Date.now()}`;

  // Parcel payload for Guepex
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

  // Save to DB regardless of success
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

  // Send notifications (fire and forget)
  const customerName = `${body.firstname} ${body.familyname}`;
  const deliveryType = body.is_stopdesk ? "سحب من مكتب" : "توصيل للباب";
  const notifMessage = success
    ? `📦 طلب جديد!\n\nالعميل: ${customerName}\nالهاتف: ${normalizedPhone}\nالولاية: ${body.to_wilaya_name}\nالبلدية: ${body.to_commune_name}\nالتوصيل: ${deliveryType}\nالتتبع: ${tracking}\nسعر الكتاب: ${BOOK_PRICE} DA\nسعر التوصيل: ${deliveryPrice} DA\nالمجموع: ${totalPrice} DA`
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

  // Await notifications before responding so Netlify doesn't kill them
    try {
      await Promise.all([
        sendTelegramNotification(notifMessage),
        sendEmailNotification(
          success ? `📦 طلب جديد — ${customerName} — ${body.to_wilaya_name}` : `⚠️ طلب فاشل — ${customerName}`,
          emailHtml
        ),
      ]);
    } catch (err) {
      logger.error({ err }, "Notification error");
    }

    res.status(200).json(
      CreateOrderResponse.parse({ success, tracking, label, message: errorMessage })
    );
  });

  export default router;
