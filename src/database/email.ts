import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import { emailMarkup } from "../utils/emailMarkup";
import { ContactFormData } from "../types";

export async function sendContactEmail(data: ContactFormData) {
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: port,
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  const text = `
Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
Sent: ${DateTime.now().toISO()}
Server: Express (SMTP)
`.trim();

  const info = await transporter.sendMail({
    from: { name: data.name, address: "contact@tychovanrosmalen.nl" },
    to: process.env.EMAIL_TO!,
    subject: `Portfolio Contact: ${data.subject}`,
    text,
    html: emailMarkup(data),
    envelope: {
      from: "contact@tychovanrosmalen.nl",
      to: process.env.EMAIL_TO!,
    },
  });

  return { messageId: info.messageId };
}
