import nodemailer from "nodemailer";
import { Resend } from "resend";
import { config } from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.secure,
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.pass
  }
});

export const emailService = {
  /**
   * Dispatches a 6-digit verification code to the student email using SMTP (with Resend fallback).
   */
  async sendOtpEmail(toEmail: string, studentName: string, otpCode: string): Promise<{ success: boolean; id?: string; error?: string }> {
    const subject = `Your Innovacio AI Labs Verification Code: ${otpCode}`;
    const fromAddress = `"Innovacio AI Labs" <${config.email.smtp.from}>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);padding:32px 36px;text-align:center;">
              <span style="display:inline-block;background:rgba(37,99,235,0.25);border:1px solid rgba(59,130,246,0.4);color:#93c5fd;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:4px 12px;border-radius:999px;margin-bottom:12px;">
                ACADEMIC ADMISSIONS &bull; 2026 COHORT
              </span>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">
                Innovacio AI Labs
              </h1>
              <p style="margin:6px 0 0 0;color:#cbd5e1;font-size:13px;">
                School of Advanced Artificial Intelligence &amp; Supercomputing
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 36px 28px 36px;">
              <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#0f172a;">
                Hello ${studentName || "Student"},
              </h2>
              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;">
                Thank you for applying to Innovacio AI Labs. To complete your student account registration and activate access to your GPU supercomputing cluster portal, please verify your email address with the verification code below:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background-color:#eff6ff;border:2px dashed #3b82f6;border-radius:14px;padding:24px 20px;">
                    <div style="font-size:12px;font-weight:800;color:#1d4ed8;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;">
                      Your 6-Digit Verification Code
                    </div>
                    <div style="font-size:40px;font-weight:900;letter-spacing:10px;color:#1e3a8a;font-family:'Courier New',Courier,monospace;">
                      ${otpCode}
                    </div>
                    <div style="font-size:12px;color:#64748b;margin-top:10px;">
                      Expires in <strong>10 minutes</strong>. Never share this code with anyone.
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#64748b;">
                If you did not initiate this registration, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #f1f5f9;padding:24px 36px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#334155;">
                Innovacio AI Labs Campus
              </p>
              <p style="margin:0 0 8px 0;font-size:11px;color:#94a3b8;line-height:1.5;">
                Park Center Complex, Park Street Commercial Corridor, Kolkata, West Bengal 700016<br />
                Direct Admissions Desk: admissions@innovacio-ailabs.edu &bull; +91 (033) 4022-8900
              </p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                &copy; 2026 Innovacio AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject,
        html: htmlContent
      });

      console.log(`✉️ [SMTP SUCCESS] Dispatched verification code to ${toEmail} (MessageId: ${info.messageId})`);
      return { success: true, id: info.messageId };
    } catch (smtpErr: any) {
      console.warn(`⚠️ [SMTP NOTICE] Could not send via SMTP to ${toEmail}: ${smtpErr.message}`);

      // Fallback to Resend if configured
      if (config.email.resendApiKey) {
        try {
          const resend = new Resend(config.email.resendApiKey);
          const response = await resend.emails.send({
            from: config.email.fromEmail,
            to: [toEmail],
            subject,
            html: htmlContent
          });

          if (response.data?.id) {
            console.log(`✉️ [RESEND FALLBACK SUCCESS] Dispatched to ${toEmail} (ID: ${response.data.id})`);
            return { success: true, id: response.data.id };
          }
        } catch (resendErr: any) {
          console.warn(`⚠️ [RESEND FALLBACK ERROR] ${resendErr.message}`);
        }
      }

      return { success: false, error: smtpErr.message };
    }
  },

  /**
   * Dispatches a new Consultation Lead notification email to the administrator (jayesh@innovaciotechnologies.com).
   */
  async sendConsultationLeadNotification(lead: {
    name: string;
    phone: string;
    email?: string;
    program: string;
    mode?: string;
    notes?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    const adminEmail = config.email.smtp.user || "jayesh@innovaciotechnologies.com";
    const subject = `🎓 New Course Consultation Lead: ${lead.name} — ${lead.program}`;
    const fromAddress = `"Innovacio AI Admissions" <${config.email.smtp.from}>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Consultation Lead</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;background-color:#f1f5f9;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);padding:28px 32px;color:#ffffff;">
              <span style="display:inline-block;background:rgba(37,99,235,0.3);border:1px solid rgba(147,197,253,0.4);color:#93c5fd;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;padding:3px 10px;border-radius:999px;margin-bottom:8px;">
                NEW ADMISSION INQUIRY
              </span>
              <h2 style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.02em;">
                Course Consultation Lead
              </h2>
              <p style="margin:4px 0 0;font-size:13px;color:#cbd5e1;">
                Innovacio AI Labs &bull; Student Admissions Portal
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;width:150px;font-weight:600;">
                    Interested Course
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:15px;color:#1e40af;font-weight:700;">
                    ${lead.program}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;">
                    Candidate Name
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14.5px;color:#0f172a;font-weight:600;">
                    ${lead.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;">
                    Phone Number
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14.5px;color:#0f172a;font-weight:600;">
                    <a href="tel:${lead.phone}" style="color:#2563eb;text-decoration:none;font-weight:700;">${lead.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;">
                    Email Address
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">
                    ${lead.email ? `<a href="mailto:${lead.email}" style="color:#2563eb;text-decoration:none;">${lead.email}</a>` : "Not provided"}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;">
                    Preferred Mode
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-transform:capitalize;">
                    ${lead.mode || "Live Online & Offline (Park Street)"}
                  </td>
                </tr>
                ${lead.notes ? `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;font-weight:600;">
                    Candidate Query
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#334155;">
                    ${lead.notes}
                  </td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding:12px 0;font-size:13px;color:#64748b;font-weight:600;">
                    Received At
                  </td>
                  <td style="padding:12px 0;font-size:13px;color:#64748b;">
                    ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center;font-size:12px;color:#94a3b8;">
              Innovacio AI Labs Admissions Engine &bull; Park Street Campus, Kolkata
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        subject,
        html: htmlContent
      });

      console.log(`✉️ [CONSULTATION LEAD SENT] Delivered to ${adminEmail} (Msg ID: ${info.messageId})`);
      return { success: true, id: info.messageId };
    } catch (err: any) {
      console.warn(`⚠️ [CONSULTATION LEAD EMAIL NOTICE] ${err.message}`);
      return { success: false, error: err.message };
    }
  }
};
