import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vapiWebhookSchema } from "@/lib/validations";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? "";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = vapiWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ received: true });
  }

  const { type, call } = parsed.data;

  if (!call?.id) {
    return NextResponse.json({ received: true });
  }

  const session = await prisma.auditSession.findUnique({
    where: { vapiCallId: call.id },
    include: { lead: true },
  });

  if (!session) {
    console.warn(`No session found for VAPI call: ${call.id}`);
    return NextResponse.json({ received: true });
  }

  switch (type) {
    case "call.started":
    case "call-started":
      await prisma.auditSession.update({
        where: { id: session.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      });
      await prisma.lead.update({
        where: { id: session.leadId },
        data: { status: "CALL_IN_PROGRESS" },
      });
      break;

    case "call.ended":
    case "call-ended": {
      const transcript =
        call.artifact?.transcript ?? call.transcript ?? "";
      const duration = call.duration ?? null;
      const recordingUrl = call.artifact?.recordingUrl ?? call.recordingUrl ?? null;

      await prisma.auditSession.update({
        where: { id: session.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          duration,
        },
      });

      await prisma.lead.update({
        where: { id: session.leadId },
        data: { status: "CALL_COMPLETED" },
      });

      if (transcript) {
        await prisma.callTranscript.upsert({
          where: { sessionId: session.id },
          create: {
            sessionId: session.id,
            rawTranscript: transcript,
            summary: call.summary ?? null,
            callDuration: duration,
            recordingUrl,
          },
          update: {
            rawTranscript: transcript,
            summary: call.summary ?? null,
            callDuration: duration,
            recordingUrl,
          },
        });

        await prisma.activityLog.create({
          data: {
            leadId: session.leadId,
            action: "call_completed",
            metadata: { duration, hasTranscript: true },
          },
        });

        // Trigger async AI report generation
        fetch(`${APP_URL}/api/reports/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.id,
            internalSecret: INTERNAL_SECRET,
          }),
        }).catch((err) => console.error("Failed to trigger report generation:", err));
      }
      break;
    }

    case "call.failed":
    case "call-failed":
      await prisma.auditSession.update({
        where: { id: session.id },
        data: {
          status: "FAILED",
          errorMessage: call.endedReason ?? "Call failed",
        },
      });
      await prisma.activityLog.create({
        data: {
          leadId: session.leadId,
          action: "call_failed",
          metadata: { reason: call.endedReason },
        },
      });
      break;
  }

  return NextResponse.json({ received: true });
}
