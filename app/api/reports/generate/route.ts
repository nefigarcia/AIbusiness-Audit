import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportGenerateSchema } from "@/lib/validations";
import { analyzeTranscript, generateReportHTML } from "@/services/openai";
import { sendAuditReport, sendConsultationInvite } from "@/services/resend";

export const maxDuration = 60; // Vercel Pro allows up to 60s on serverless

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reportGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { sessionId, internalSecret } = parsed.data;

  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await prisma.auditSession.findUnique({
    where: { id: sessionId },
    include: {
      lead: true,
      transcript: true,
      report: true,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.report) {
    return NextResponse.json({ reportId: session.report.id, cached: true });
  }

  if (!session.transcript?.rawTranscript) {
    return NextResponse.json(
      { error: "No transcript available" },
      { status: 422 }
    );
  }

  const lead = session.lead;

  const analysis = await analyzeTranscript({
    transcript: session.transcript.rawTranscript,
    businessName: lead.businessName,
    industry: lead.industry,
    companySize: lead.companySize,
    mainChallenge: lead.mainChallenge,
  });

  const htmlContent = await generateReportHTML(
    analysis,
    lead.businessName,
    lead.name,
    lead.industry
  );

  const report = await prisma.aIReport.create({
    data: {
      sessionId: session.id,
      executiveSummary: analysis.executiveSummary,
      bottlenecks: analysis.bottlenecks as never,
      opportunities: analysis.opportunities as never,
      estimatedROI: analysis.estimatedROI as never,
      implementationRoadmap: analysis.implementationRoadmap as never,
      recommendedSystems: analysis.recommendedSystems as never,
      htmlContent,
      qualificationScore: analysis.qualificationScore,
    },
  });

  await Promise.all([
    prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: "REPORT_GENERATED",
        qualificationScore: analysis.qualificationScore,
      },
    }),
    prisma.callTranscript.update({
      where: { sessionId: session.id },
      data: { extractedData: analysis as never },
    }),
    prisma.activityLog.create({
      data: {
        leadId: lead.id,
        action: "report_generated",
        metadata: {
          reportId: report.id,
          score: analysis.qualificationScore,
        },
      },
    }),
  ]);

  const [reportEmail] = await Promise.allSettled([
    sendAuditReport({
      toEmail: lead.email,
      toName: lead.name,
      businessName: lead.businessName,
      analysis,
      reportHtml: htmlContent,
      reportId: report.id,
    }),
  ]);

  if (reportEmail.status === "fulfilled") {
    await prisma.aIReport.update({
      where: { id: report.id },
      data: { sentAt: new Date() },
    });
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "REPORT_SENT" },
    });
  }

  // Send consultation invite after a short delay (fire-and-forget)
  if (analysis.qualificationScore >= 50) {
    sendConsultationInvite({
      toEmail: lead.email,
      toName: lead.name,
      businessName: lead.businessName,
    }).catch(console.error);
  }

  return NextResponse.json({ reportId: report.id, score: analysis.qualificationScore });
}
