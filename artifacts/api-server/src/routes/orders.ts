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
