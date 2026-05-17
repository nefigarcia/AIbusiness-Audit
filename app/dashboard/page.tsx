import { prisma } from "@/lib/prisma";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { RecentLeads } from "@/components/dashboard/RecentLeads";

async function getDashboardStats() {
  const [
    totalLeads,
    newLeads,
    completedAudits,
    reportsGenerated,
    convertedLeads,
    scoreResult,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.auditSession.count({ where: { status: "COMPLETED" } }),
    prisma.aIReport.count(),
    prisma.lead.count({ where: { status: "CONVERTED" } }),
    prisma.aIReport.aggregate({ _avg: { qualificationScore: true } }),
  ]);

  return {
    totalLeads,
    newLeads,
    completedAudits,
    reportsGenerated,
    convertedLeads,
    avgQualificationScore: Math.round(scoreResult._avg.qualificationScore ?? 0),
  };
}

async function getRecentLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      auditSessions: {
        include: { report: { select: { qualificationScore: true } } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export default async function DashboardPage() {
  const [stats, recentLeads] = await Promise.all([
    getDashboardStats(),
    getRecentLeads(),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-white/40 text-sm mt-1">
          Real-time metrics across all audit sessions
        </p>
      </div>

      <AnalyticsCards stats={stats} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
          <a href="/dashboard/leads" className="text-violet-400 text-sm hover:text-violet-300">
            View all →
          </a>
        </div>
        <RecentLeads leads={recentLeads} />
      </div>
    </div>
  );
}
