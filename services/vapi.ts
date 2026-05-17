const VAPI_BASE_URL = "https://api.vapi.ai";

interface CallLeadParams {
  phoneNumber: string;
  leadId: string;
  leadName: string;
  businessName: string;
  industry: string;
  mainChallenge: string;
  sessionId: string;
}

interface VapiCall {
  id: string;
  status: string;
}

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function initiateAuditCall(params: CallLeadParams): Promise<VapiCall> {
  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  const assistantId = process.env.VAPI_ASSISTANT_ID;

  if (!apiKey || !phoneNumberId || !assistantId) {
    throw new Error("VAPI configuration missing");
  }

  const payload = {
    phoneNumberId,
    assistantId,
    customer: {
      number: toE164(params.phoneNumber),
      name: params.leadName,
    },
    assistantOverrides: {
      variableValues: {
        leadName: params.leadName,
        businessName: params.businessName,
        industry: params.industry,
        mainChallenge: params.mainChallenge,
        sessionId: params.sessionId,
      },
    },
    metadata: {
      leadId: params.leadId,
      sessionId: params.sessionId,
    },
  };

  const res = await fetch(`${VAPI_BASE_URL}/call/phone`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`VAPI call initiation failed: ${res.status} ${error}`);
  }

  return res.json() as Promise<VapiCall>;
}

export function verifyVapiWebhook(
  payload: string,
  signature: string | null
): boolean {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  // VAPI uses HMAC-SHA256 for webhook verification
  // In production, implement proper HMAC verification here
  // For now, verify the secret token matches
  return signature === secret;
}

export const VAPI_AUDIT_QUESTIONS = [
  "How do you currently handle incoming leads and new customer inquiries?",
  "Walk me through your scheduling and appointment booking process.",
  "How do you provide customer support — phone, email, chat, or a mix?",
  "What are the most repetitive tasks your team handles every day?",
  "What software or CRM tools does your business currently use?",
  "How long does it typically take to respond to a new lead or inquiry?",
  "Do you have any after-hours support coverage? How is that handled?",
  "Where do you feel your business is losing the most time or money right now?",
  "Have you tried automating anything before? What was the experience like?",
  "What would a successful outcome look like for your business in the next 12 months?",
];
