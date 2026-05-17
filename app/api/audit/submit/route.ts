import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditFormSchema } from "@/lib/validations";
import { initiateAuditCall } from "@/services/vapi";
import { sendAuditConfirmation } from "@/services/resend";
import { rateLimit } from "@/lib/rate-limit";
import type { Industry, CompanySize } from "@prisma/client";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = auditFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      industry: data.industry as Industry,
      companySize: data.companySize as CompanySize,
      mainChallenge: data.mainChallenge,
      source: "website",
      ipAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    },
  });

  const session = await prisma.auditSession.create({
    data: {
      leadId: lead.id,
      status: "PENDING",
    },
  });

  await prisma.activityLog.create({
    data: {
      leadId: lead.id,
      action: "lead_created",
      metadata: { source: "website", sessionId: session.id },
    },
  });

  // Trigger VAPI call and confirmation email concurrently
  const [vapiResult, emailResult] = await Promise.allSettled([
    initiateAuditCall({
      phoneNumber: data.phone,
      leadId: lead.id,
      leadName: data.name,
      businessName: data.businessName,
      industry: data.industry,
      mainChallenge: data.mainChallenge,
      sessionId: session.id,
    }),
    sendAuditConfirmation({
      toEmail: data.email,
      toName: data.name,
      businessName: data.businessName,
      sessionId: session.id,
    }),
  ]);

  if (vapiResult.status === "fulfilled") {
    await prisma.auditSession.update({
      where: { id: session.id },
      data: {
        vapiCallId: vapiResult.value.id,
        status: "CALL_INITIATED",
      },
    });
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "CALL_SCHEDULED" },
    });
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        action: "call_initiated",
        metadata: { vapiCallId: vapiResult.value.id },
      },
    });
  } else {
    console.error("VAPI call failed:", vapiResult.reason);
    await prisma.auditSession.update({
      where: { id: session.id },
      data: { status: "FAILED", errorMessage: String(vapiResult.reason) },
    });
  }

  if (emailResult.status === "rejected") {
    const err = emailResult.reason;
    console.error("[Resend] Confirmation email failed:", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      raw: JSON.stringify(err),
    });
  } else {
    console.log("[Resend] Confirmation email result:", JSON.stringify(emailResult.value));
  }

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    callScheduled: vapiResult.status === "fulfilled",
  });
}
