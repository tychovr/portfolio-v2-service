import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import { emailMarkup } from "../utils/emailMarkup";
import { ContactFormData } from "../types";

export async function sendContactEmail(data: ContactFormData) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
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
    from: `Portfolio Contact Form - ${process.env.EMAIL_USER}`,
    to: process.env.EMAIL_TO,
    subject: `Portfolio Contact: ${data.subject}`,
    text,
    html: emailMarkup(data),
  });

  return { messageId: info.messageId };
}
