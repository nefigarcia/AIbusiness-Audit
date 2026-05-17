import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.upsert({
    where: { id: "seed-lead-001" },
    update: {},
    create: {
      id: "seed-lead-001",
      name: "John Martinez",
      email: "john@acmeplumbing.com",
      phone: "+15555551234",
      businessName: "Acme Plumbing Co.",
      industry: "CONTRACTOR",
      companySize: "SMALL",
      mainChallenge:
        "We miss too many phone calls after hours and on weekends. We're losing thousands in potential jobs every week.",
      status: "REPORT_SENT",
      qualificationScore: 84,
      source: "seed",
    },
  });

  const session = await prisma.auditSession.upsert({
    where: { id: "seed-session-001" },
    update: {},
    create: {
      id: "seed-session-001",
      leadId: lead.id,
      status: "COMPLETED",
      duration: 780,
      completedAt: new Date(),
    },
  });

  await prisma.callTranscript.upsert({
    where: { sessionId: session.id },
    update: {},
    create: {
      sessionId: session.id,
      rawTranscript: `AI: Hi, this is the AI auditor from Auriva AI calling for John. Is now a good time to talk?
Lead: Yes, go ahead.
AI: Great! How do you currently handle incoming leads and new customer inquiries?
Lead: Mostly through phone calls. The problem is we miss a lot of them, especially after 5pm or on weekends.
AI: How many calls would you estimate you miss in a typical week?
Lead: Probably 15 to 20 calls. Each one could be a $2,000 to $5,000 job.
AI: That's significant. What about your scheduling process — how do you book jobs?
Lead: We do it manually. Someone calls, we check our whiteboard, then call them back to confirm. It's messy.
AI: Do you use any software for customer management or job tracking?
Lead: We use QuickBooks for invoicing but nothing for leads or scheduling.
AI: What's your current customer support process look like?
Lead: It's basically me and my wife answering calls. We get overwhelmed during peak season.
AI: What would you say is your single biggest operational bottleneck?
Lead: Definitely the missed calls and slow follow-up. We know we're losing business but can't figure out how to fix it.
AI: Thank you, John. This has been very helpful. We'll have your report ready within 24 hours.`,
      summary:
        "Acme Plumbing Co. is losing significant revenue due to missed after-hours calls and manual scheduling processes. They lack a CRM and are dependent on manual follow-up.",
      callDuration: 780,
    },
  });

  await prisma.aIReport.upsert({
    where: { sessionId: session.id },
    update: {},
    create: {
      sessionId: session.id,
      executiveSummary:
        "Acme Plumbing Co. operates in a high-demand service industry where response speed directly correlates to revenue. The business is currently losing an estimated $40,000–$100,000 annually due to missed calls and slow follow-up processes. With 15–20 missed calls per week at an average job value of $3,500, automation presents an immediate, high-ROI opportunity.\n\nThe primary gaps are: (1) no after-hours lead capture, (2) manual scheduling via whiteboard, (3) no automated follow-up sequences. Each of these can be addressed with existing AI tools within 30–60 days.",
      bottlenecks: [
        { area: "Lead Capture", description: "15-20 missed calls per week after hours", severity: "high", estimatedHoursLost: 12 },
        { area: "Scheduling", description: "Manual whiteboard scheduling with callback confirmation", severity: "high", estimatedHoursLost: 8 },
        { area: "Follow-up", description: "No systematic follow-up on missed calls or estimates", severity: "medium", estimatedHoursLost: 5 },
      ],
      opportunities: [
        { title: "24/7 AI Voice Agent", description: "Deploy AI agent to answer all calls 24/7, collect job details, and book appointments", impact: "high", effort: "low", estimatedTimeSaved: 18, tools: ["VAPI", "Google Calendar API"] },
        { title: "Automated Scheduling", description: "Digital scheduling system with instant confirmation texts", impact: "high", effort: "low", estimatedTimeSaved: 12, tools: ["Calendly", "Twilio"] },
        { title: "Missed Call Follow-up", description: "Automated SMS/email sequence for every missed call", impact: "medium", effort: "low", estimatedTimeSaved: 8, tools: ["Twilio", "Mailchimp"] },
      ],
      estimatedROI: {
        monthlyHoursSaved: 38,
        annualHoursSaved: 456,
        estimatedMonthlySavings: 6200,
        estimatedAnnualSavings: 74400,
        implementationCost: "$2,000 - $4,000",
        paybackPeriod: "3-4 weeks",
      },
      implementationRoadmap: [
        { phase: 1, title: "Quick Wins", duration: "Week 1-2", actions: ["Deploy AI call answering", "Set up missed call SMS", "Create online booking page"], expectedOutcome: "Stop losing after-hours leads immediately" },
        { phase: 2, title: "Core Automation", duration: "Week 3-6", actions: ["Integrate scheduling software", "Build follow-up sequences", "Set up basic CRM"], expectedOutcome: "50% reduction in manual admin work" },
      ],
      recommendedSystems: [
        { name: "VAPI", category: "Voice AI", description: "AI phone agent for 24/7 call handling", useCase: "Answer and book calls after hours" },
        { name: "Jobber", category: "CRM", description: "Field service management software", useCase: "Replace whiteboard scheduling" },
      ],
      htmlContent: "<html><body><p>Report HTML here</p></body></html>",
      qualificationScore: 84,
      sentAt: new Date(),
    },
  });

  await prisma.activityLog.createMany({
    data: [
      { leadId: lead.id, action: "lead_created", metadata: { source: "seed" } },
      { leadId: lead.id, action: "call_initiated", metadata: { vapiCallId: "seed-call-001" } },
      { leadId: lead.id, action: "call_completed", metadata: { duration: 780 } },
      { leadId: lead.id, action: "report_generated", metadata: { score: 84 } },
    ],
  });

  console.log("Seed complete:", { leadId: lead.id, sessionId: session.id });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
