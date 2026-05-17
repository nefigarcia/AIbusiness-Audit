import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Building, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, getStatusColor, getScoreColor, formatPhoneNumber } from "@/lib/utils";
import { ReportViewer } from "@/components/dashboard/ReportViewer";
import { TranscriptViewer } from "@/components/dashboard/TranscriptViewer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lead Detail — Auriva AI" };

async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      auditSessions: {
        include: {
          transcript: true,
          report: true,
        },
        orderBy: { createdAt: "desc" },
      },
      followUpTasks: { orderBy: { createdAt: "desc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const latestSession = lead.auditSessions[0];
  const report = latestSession?.report;
  const transcript = latestSession?.transcript;

  return (
    <div className="p-8">
      <Link
        href="/dashboard/leads"
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col — lead info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0f1625] border border-white/8 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-white font-bold text-lg">{lead.name}</h1>
                <div className="text-white/40 text-sm">{lead.businessName}</div>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(lead.status)}`}
              >
                {lead.status.replace(/_/g, " ")}
              </span>
            </div>

            {report && (
              <div className="mb-4 bg-[#0a0a15] rounded-lg p-3 text-center">
                <div className="text-xs text-white/40 mb-1">Opportunity Score</div>
                <div className={`text-3xl font-black ${getScoreColor(report.qualificationScore)}`}>
                  {report.qualificationScore}
                  <span className="text-lg text-white/20">/100</span>
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="w-3.5 h-3.5 text-white/20" />
                <a href={`mailto:${lead.email}`} className="hover:text-violet-400 transition-colors">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Phone className="w-3.5 h-3.5 text-white/20" />
                <span>{formatPhoneNumber(lead.phone)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Building className="w-3.5 h-3.5 text-white/20" />
                <span>{lead.industry} · {lead.companySize}</span>
              </div>
              <div className="flex items-start gap-2 text-white/40 text-xs">
                <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{formatDateTime(lead.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f1625] border border-white/8 rounded-xl p-5">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">
              Main Challenge
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">{lead.mainChallenge}</p>
          </div>

          {/* Activity log */}
          <div className="bg-[#0f1625] border border-white/8 rounded-xl p-5">
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-4">
              Activity
            </h3>
            <div className="space-y-3">
              {lead.activityLogs.map((log: { id: string; action: string; createdAt: Date }) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-white/60 text-xs">{log.action.replace(/_/g, " ")}</div>
                    <div className="text-white/20 text-[11px]">{formatDateTime(log.createdAt)}</div>
                  </div>
                </div>
              ))}
              {lead.activityLogs.length === 0 && (
                <div className="text-white/20 text-xs">No activity yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Right col — transcript + report */}
        <div className="lg:col-span-2 space-y-6">
          {transcript && <TranscriptViewer transcript={transcript} />}
          {report && <ReportViewer report={report} />}
          {!transcript && !report && (
            <div className="bg-[#0f1625] border border-white/8 rounded-xl p-12 text-center">
              <div className="text-white/20 text-sm">
                {latestSession?.status === "PENDING" || latestSession?.status === "CALL_INITIATED"
                  ? "Waiting for the call to complete…"
                  : "No audit data available yet."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
