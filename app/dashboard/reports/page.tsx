import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, getScoreColor } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports — Auriva AI" };

export default async function ReportsPage() {
  const reports = await prisma.aIReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      session: {
        include: { lead: { select: { id: true, name: true, businessName: true, industry: true } } },
      },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-white/40 text-sm mt-1">{reports.length} reports generated</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[#0f1625] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <Link
                    href={`/dashboard/leads/${report.session.lead.id}`}
                    className="text-white font-semibold hover:text-violet-400 transition-colors"
                  >
                    {report.session.lead.businessName}
                  </Link>
                  <div className="text-white/40 text-sm">{report.session.lead.name}</div>
                  <div className="text-white/25 text-xs mt-0.5">
                    {report.session.lead.industry} · {formatDate(report.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className={`text-2xl font-black ${getScoreColor(report.qualificationScore)}`}>
                    {report.qualificationScore}
                  </div>
                  <div className="text-white/30 text-xs">score</div>
                </div>
                {report.sentAt && (
                  <span className="text-[11px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Sent
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-white/40 text-xs line-clamp-2">
                {report.executiveSummary}
              </p>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="bg-[#0f1625] border border-white/8 rounded-xl p-12 text-center">
            <div className="text-white/20 text-sm">No reports generated yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
