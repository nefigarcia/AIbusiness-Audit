import Link from "next/link";
import { formatDate, getStatusColor, getScoreColor } from "@/lib/utils";
import type { Lead, AuditSession, AIReport } from "@/types";

type LeadWithSession = Lead & {
  auditSessions: (AuditSession & {
    report: Pick<AIReport, "qualificationScore"> | null;
  })[];
};

interface Props {
  leads: LeadWithSession[];
}

export function RecentLeads({ leads }: Props) {
  if (leads.length === 0) {
    return (
      <div className="bg-[#0f1625] border border-white/8 rounded-xl p-12 text-center">
        <div className="text-white/20 text-sm">No leads yet. Share your audit link to get started.</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1625] border border-white/8 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {["Name", "Business", "Industry", "Status", "Score", "Date"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const score = lead.auditSessions[0]?.report?.qualificationScore;
            return (
              <tr
                key={lead.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3.5">
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="text-white text-sm font-medium hover:text-violet-400 transition-colors"
                  >
                    {lead.name}
                  </Link>
                  <div className="text-white/30 text-xs">{lead.email}</div>
                </td>
                <td className="px-4 py-3.5 text-white/60 text-sm">{lead.businessName}</td>
                <td className="px-4 py-3.5 text-white/40 text-xs">{lead.industry}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(lead.status)}`}
                  >
                    {lead.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {score !== undefined && score !== null ? (
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  ) : (
                    <span className="text-white/20 text-sm">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-white/30 text-xs">
                  {formatDate(lead.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
