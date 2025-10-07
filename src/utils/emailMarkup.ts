import { DateTime } from "luxon";
import { escapeHtml } from "./escapeHtml";
import { ContactFormData } from "../types";

export function emailMarkup(
  data: ContactFormData,
  footerNote = "Sent from your portfolio contact form"
) {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Contact</title>
  </head>
  <body style="margin:0;background:#0b1220;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b1220;padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="background:#0f172a;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.35);">
            <tr>
              <td style="background:linear-gradient(135deg,#10b981,#059669);padding:28px 32px;">
                <h1 style="margin:0;font-size:24px;line-height:1.25;color:#fff;">📨 New Portfolio Contact</h1>
                <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                  Someone reached out via your portfolio
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="padding:24px 32px;">
                <!-- Contact -->
                <div style="background:#0b1020;border:1px solid #1f2a44;border-radius:12px;padding:16px 18px;margin-bottom:14px;">
                  <h3 style="margin:0 0 8px 0;font-size:15px;color:#e2e8f0;">👤 Contact</h3>
                  <p style="margin:6px 0;color:#9fb0c0;font-size:14px;"><strong style="color:#e2e8f0;">Name:</strong> ${escapeHtml(
                    data.name
                  )}</p>
                  <p style="margin:6px 0;color:#9fb0c0;font-size:14px;">
                    <strong style="color:#e2e8f0;">Email:</strong>
                    <a href="mailto:${
                      data.email
                    }" style="color:#34d399;text-decoration:none;">${
    data.email
  }</a>
                  </p>
                </div>
  
                <!-- Subject -->
                <div style="background:#0b1020;border:1px solid #1f2a44;border-radius:12px;padding:16px 18px;margin-bottom:14px;">
                  <h3 style="margin:0 0 8px 0;font-size:15px;color:#e2e8f0;">📝 Subject</h3>
                  <p style="margin:6px 0;color:#c7d2fe;font-size:15px;font-weight:600;">${escapeHtml(
                    data.subject
                  )}</p>
                </div>
  
                <!-- Message -->
                <div style="background:#0b1020;border:1px solid #1f2a44;border-radius:12px;padding:16px 18px;margin-bottom:14px;">
                  <h3 style="margin:0 0 8px 0;font-size:15px;color:#e2e8f0;">💬 Message</h3>
                  <pre style="margin:0;color:#b6c2d9;font-size:14px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(
                    data.message
                  )}</pre>
                </div>
  
                <!-- Actions -->
                <div style="text-align:center;margin-top:18px;">
                  <a href="mailto:${encodeURIComponent(
                    data.email
                  )}?subject=Re:%20${encodeURIComponent(data.subject)}"
                     style="display:inline-block;background:#10b981;color:#04101a;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:700;box-shadow:0 6px 20px rgba(16,185,129,0.35);">
                    ↩️ Reply to ${escapeHtml(data.name)}
                  </a>
                </div>
  
                <!-- Timestamp -->
                <p style="margin:18px 0 0 0;color:#7c8aa5;font-size:12px;text-align:center;">
                  Received: ${new Date().toLocaleString("en-US", {
                    timeZone: "Europe/Berlin",
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="background:#0b1020;padding:14px 24px;text-align:center;border-top:1px solid #1f2a44;">
                <p style="margin:0;color:#6b7b95;font-size:12px;">${escapeHtml(
                  footerNote
                )}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `;
}
