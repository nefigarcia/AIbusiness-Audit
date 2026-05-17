import { Users, Mic, FileText, TrendingUp, Target, Star } from "lucide-react";
import type { DashboardStats } from "@/types";

interface Props {
  stats: DashboardStats;
}

export function AnalyticsCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.newLeads} new`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Audits Completed",
      value: stats.completedAudits,
      sub: "calls finished",
      icon: Mic,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Reports Generated",
      value: stats.reportsGenerated,
      sub: "AI reports",
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Converted",
      value: stats.convertedLeads,
      sub: `${stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}% rate`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "Avg. Opportunity Score",
      value: `${stats.avgQualificationScore}/100`,
      sub: "qualification",
      icon: Target,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} border rounded-xl p-5`}
        >
          <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
          <div className="text-2xl font-bold text-white mb-0.5">{card.value}</div>
          <div className="text-white/50 text-xs">{card.label}</div>
          <div className="text-white/25 text-[11px] mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
