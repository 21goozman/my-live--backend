import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text, html }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    return { sent: false, reason: "mailer not configured" };
  }
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  await transport.sendMail({ from: FROM_EMAIL, to, subject, text, html });
  return { sent: true };
}
