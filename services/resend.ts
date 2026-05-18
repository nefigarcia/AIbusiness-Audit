import { Resend } from "resend";
import type { AnalysisResult } from "@/types";

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return `${process.env.RESEND_FROM_NAME ?? "Auriva AI"} <${process.env.RESEND_FROM_EMAIL ?? "noreply@auriva.com"}>`;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://auriva.im";

export async function sendAuditConfirmation(params: {
  toEmail: string;
  toName: string;
  businessName: string;
  sessionId: string;
}) {
  return getResend().emails.send({
    from: getFrom(),
    to: params.toEmail,
    subject: `Your AI Business Audit is scheduled — ${params.businessName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);display:inline-block;padding:10px 24px;border-radius:8px;">
        <span style="color:#fff;font-size:16px;font-weight:700;">AURIVA AI</span>
      </div>
    </div>
    <div style="background:#111827;border-radius:16px;padding:32px;">
      <h1 style="color:#e2e8f0;font-size:24px;font-weight:700;margin:0 0 16px;">Your AI audit is confirmed ✓</h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Hi ${params.toName}, we've received your audit request for <strong style="color:#e2e8f0;">${params.businessName}</strong>.
        Our AI voice agent will call you shortly at the phone number you provided.
      </p>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0 0 12px;">What to expect:</h3>
        <ul style="color:#94a3b8;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
          <li>A 10–15 minute AI-powered interview about your operations</li>
          <li>Questions about your workflows, challenges, and goals</li>
          <li>Honest, no-pressure conversation</li>
          <li>Your personalized AI optimization report delivered to this email</li>
        </ul>
      </div>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">
        Keep your phone handy — the call will come from our AI auditor within the next few minutes.
        If you have any questions, reply to this email.
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;">© ${new Date().getFullYear()} Auriva AI · Helping businesses automate smarter</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendAuditReport(params: {
  toEmail: string;
  toName: string;
  businessName: string;
  analysis: AnalysisResult;
  reportHtml: string;
  reportId: string;
}) {
  const scoreColor =
    params.analysis.qualificationScore >= 70
      ? "#22c55e"
      : params.analysis.qualificationScore >= 50
      ? "#f59e0b"
      : "#ef4444";

  return getResend().emails.send({
    from: getFrom(),
    to: params.toEmail,
    subject: `Your AI Optimization Report is ready — ${params.businessName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);display:inline-block;padding:10px 24px;border-radius:8px;">
        <span style="color:#fff;font-size:16px;font-weight:700;">AURIVA AI</span>
      </div>
    </div>
    <div style="background:#111827;border-radius:16px;padding:32px;margin-bottom:20px;">
      <h1 style="color:#e2e8f0;font-size:24px;font-weight:700;margin:0 0 8px;">Your AI Report is Ready 🚀</h1>
      <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;">Hi ${params.toName}, here's your personalized AI optimization report for <strong style="color:#e2e8f0;">${params.businessName}</strong>.</p>
      <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.15));border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Your Automation Score</p>
        <div style="font-size:48px;font-weight:800;color:${scoreColor};line-height:1;">${params.analysis.qualificationScore}<span style="font-size:20px;color:#64748b;">/100</span></div>
        <p style="color:#94a3b8;font-size:13px;margin:8px 0 0;">We found <strong style="color:#e2e8f0;">${params.analysis.opportunities.length} automation opportunities</strong> that could save you <strong style="color:#7c3aed;">${params.analysis.estimatedROI.monthlyHoursSaved} hours/month</strong></p>
      </div>
      <div style="text-align:center;">
        <a href="${APP_URL}/reports/${params.reportId}" style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;margin-bottom:16px;">View Full Report</a>
        <br>
        <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? APP_URL}" style="color:#7c3aed;font-size:14px;text-decoration:none;">Schedule a Free Consultation →</a>
      </div>
    </div>
    <div style="text-align:center;">
      <p style="color:#475569;font-size:12px;">© ${new Date().getFullYear()} Auriva AI</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendConsultationInvite(params: {
  toEmail: string;
  toName: string;
  businessName: string;
}) {
  return getResend().emails.send({
    from: getFrom(),
    to: params.toEmail,
    subject: `Let's build your automation plan — ${params.businessName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);display:inline-block;padding:10px 24px;border-radius:8px;">
        <span style="color:#fff;font-size:16px;font-weight:700;">AURIVA AI</span>
      </div>
    </div>
    <div style="background:#111827;border-radius:16px;padding:32px;">
      <h1 style="color:#e2e8f0;font-size:24px;font-weight:700;margin:0 0 16px;">Ready to automate ${params.businessName}?</h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Hi ${params.toName}, your AI audit identified significant automation opportunities. Our team is ready to build a custom implementation plan for your business.
      </p>
      <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0 0 8px;">In your free 30-min consultation we will:</p>
        <ul style="color:#94a3b8;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
          <li>Review your personalized automation roadmap</li>
          <li>Identify the highest-impact quick wins</li>
          <li>Provide a transparent pricing breakdown</li>
          <li>Answer all your questions — no pressure</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}" style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">Book My Free Consultation</a>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;">© ${new Date().getFullYear()} Auriva AI</p>
    </div>
  </div>
</body>
</html>`,
  });
}
