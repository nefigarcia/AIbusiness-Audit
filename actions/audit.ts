"use server";

import { auditFormSchema } from "@/lib/validations";
import type { AuditSubmitResult } from "@/types";

export async function submitAuditAction(
  _prevState: AuditSubmitResult,
  formData: FormData
): Promise<AuditSubmitResult> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = auditFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${appUrl}/api/audit/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string; errors?: Record<string, string[]> };
    if (res.status === 429) {
      return { success: false, message: "Too many requests. Please try again later." };
    }
    if (res.status === 422 && body.errors) {
      return { success: false, errors: body.errors };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  const data = (await res.json()) as { sessionId?: string };
  return { success: true, sessionId: data.sessionId };
}
