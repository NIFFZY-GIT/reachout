import "server-only";
import nodemailer from "nodemailer";

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendAdminMessageNotification(
  to: string,
  username: string,
  conversationId: string,
) {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured; admin message notification could not be sent.");
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `New message from @${username} on ReachOut`,
    text: `@${username} sent a new message. Sign in to your ReachOut admin console to read and reply.\n\nConversation ID: ${conversationId}`,
  });
}
