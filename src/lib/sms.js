export async function sendSMS(phone, message) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    return { sent: false, reason: "sms not configured" };
  }
  const twilio = (await import("twilio")).default;
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({ from: TWILIO_FROM, to: phone, body: message });
  return { sent: true };
}
