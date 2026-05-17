import { FileText, TrendingUp, Target, Clock, DollarSign } from "lucide-react";
import { getScoreColor, formatCurrency } from "@/lib/utils";
import type { AIReport } from "@/types";
import type {
  ReportBottleneck,
  AutomationOpportunity,
  ROIEstimate,
  RoadmapPhase,
  RecommendedSystem,
} from "@/types";

interface Props {
  report: AIReport;
}

export function ReportViewer({ report }: Props) {
  const bottlenecks = report.bottlenecks as unknown as ReportBottleneck[];
  const opportunities = report.opportunities as unknown as AutomationOpportunity[];
  const roi = report.estimatedROI as unknown as ROIEstimate;
  const roadmap = report.implementationRoadmap as unknown as RoadmapPhase[];
  const systems = report.recommendedSystems as unknown as RecommendedSystem[];

  return (
    <div className="bg-[#0f1625] border border-white/8 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">AI Optimization Report</h3>
        </div>
        <div className={`text-xl font-black ${getScoreColor(report.qualificationScore)}`}>
          {report.qualificationScore}
          <span className="text-sm text-white/20">/100</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Executive Summary */}
        <div>
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">
            Executive Summary
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
            {report.executiveSummary}
          </p>
        </div>

        {/* ROI */}
        <div>
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">
            ROI Estimate
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Monthly Hours Saved", value: `${roi.monthlyHoursSaved}h`, icon: Clock, color: "text-violet-400" },
              { label: "Monthly Savings", value: formatCurrency(roi.estimatedMonthlySavings), icon: DollarSign, color: "text-green-400" },
              { label: "Annual Savings", value: formatCurrency(roi.estimatedAnnualSavings), icon: TrendingUp, color: "text-green-400" },
              { label: "Payback Period", value: roi.paybackPeriod, icon: Target, color: "text-yellow-400" },
            ].map((item) => (
              <div key={item.label} className="bg-[#0a0a15] rounded-lg p-3">
                <item.icon className={`w-4 h-4 ${item.color} mb-1.5`} />
                <div className={`text-base font-bold ${item.color}`}>{item.value}</div>
                <div className="text-white/30 text-[11px] mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Opportunities */}
        {opportunities.length > 0 && (
          <div>
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">
              Automation Opportunities
            </div>
            <div className="space-y-2">
              {opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a15] border border-white/5 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-white text-sm font-semibold">{opp.title}</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        opp.impact === "high"
                          ? "bg-green-500/20 text-green-400"
                          : opp.impact === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {opp.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-2">{opp.description}</p>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span className="text-violet-400">⏱ {opp.estimatedTimeSaved}h/month</span>
                    {opp.tools.slice(0, 3).map((t) => (
                      <span key={t} className="bg-white/5 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation Roadmap */}
        {roadmap.length > 0 && (
          <div>
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">
              Implementation Roadmap
            </div>
            <div className="space-y-3">
              {roadmap.map((phase) => (
                <div key={phase.phase} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0 mt-0.5">
                    {phase.phase}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {phase.title}{" "}
                      <span className="text-white/30 font-normal text-xs">({phase.duration})</span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {phase.actions.slice(0, 3).map((a, i) => (
                        <li key={i} className="text-white/40 text-xs flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-violet-400/40" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
