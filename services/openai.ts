import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import type { AnalysisResult } from "@/types";

const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

const SYSTEM_PROMPT = `You are a senior AI business consultant at Auriva AI, specializing in workflow automation and operational efficiency. Your role is to analyze business interview transcripts and generate comprehensive, actionable AI optimization reports.

Your analysis must be:
- Specific to the business described, not generic
- Data-driven with concrete ROI estimates
- Practical with realistic implementation timelines
- Prioritized by impact and ease of implementation

Always respond with valid JSON matching the exact schema provided.`;

interface AnalysisInput {
  transcript: string;
  businessName: string;
  industry: string;
  companySize: string;
  mainChallenge: string;
}

export async function analyzeTranscript(input: AnalysisInput): Promise<AnalysisResult> {
  const userPrompt = `Analyze this business interview transcript for ${input.businessName}, a ${input.companySize} company in the ${input.industry} industry.

Their stated main challenge: "${input.mainChallenge}"

INTERVIEW TRANSCRIPT:
${input.transcript}

Generate a comprehensive AI optimization report. Return ONLY valid JSON with this exact structure:

{
  "executiveSummary": "2-3 paragraph executive summary of the business situation and key opportunities",
  "bottlenecks": [
    {
      "area": "process area name",
      "description": "specific description of the inefficiency",
      "severity": "high|medium|low",
      "estimatedHoursLost": 10
    }
  ],
  "opportunities": [
    {
      "title": "automation opportunity title",
      "description": "detailed description of how this automation works",
      "impact": "high|medium|low",
      "effort": "high|medium|low",
      "estimatedTimeSaved": 8,
      "tools": ["Tool 1", "Tool 2"]
    }
  ],
  "estimatedROI": {
    "monthlyHoursSaved": 40,
    "annualHoursSaved": 480,
    "estimatedMonthlySavings": 3200,
    "estimatedAnnualSavings": 38400,
    "implementationCost": "$2,000 - $5,000",
    "paybackPeriod": "2-3 months"
  },
  "implementationRoadmap": [
    {
      "phase": 1,
      "title": "Quick Wins",
      "duration": "Month 1-2",
      "actions": ["action 1", "action 2", "action 3"],
      "expectedOutcome": "expected outcome description"
    }
  ],
  "recommendedSystems": [
    {
      "name": "System Name",
      "category": "CRM|Voice AI|Scheduling|Support|Marketing|Analytics",
      "description": "brief description",
      "useCase": "specific use case for this business"
    }
  ],
  "qualificationScore": 75
}

The qualificationScore (0-100) reflects how strong an automation opportunity this business represents:
- 80-100: Hot lead, multiple high-impact opportunities
- 60-79: Good lead, clear opportunities
- 40-59: Warm lead, some opportunities
- Below 40: Low priority

Be specific and concrete. Reference details from the actual transcript.`;

  const result = await ai.generate({
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    output: { format: "json" },
  });

  const content = result.output ?? (result.text ? JSON.parse(result.text) : null);
  if (!content) throw new Error("Gemini returned empty response");

  return content as AnalysisResult;
}

export async function generateReportHTML(
  analysis: AnalysisResult,
  businessName: string,
  leadName: string,
  industry: string
): Promise<string> {
  const scoreColor = analysis.qualificationScore >= 70
    ? "#22c55e"
    : analysis.qualificationScore >= 50
    ? "#f59e0b"
    : "#ef4444";

  const opportunitiesHTML = analysis.opportunities
    .map(
      (opp, i) => `
      <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <h4 style="color:#e2e8f0;font-size:17px;font-weight:600;margin:0;">${i + 1}. ${opp.title}</h4>
          <span style="background:${opp.impact === "high" ? "#166534" : opp.impact === "medium" ? "#854d0e" : "#1e3a5f"};color:${opp.impact === "high" ? "#86efac" : opp.impact === "medium" ? "#fde68a" : "#93c5fd"};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;">
            ${opp.impact.toUpperCase()} IMPACT
          </span>
        </div>
        <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 12px;">${opp.description}</p>
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="color:#7c3aed;font-size:13px;font-weight:600;">⏱ ${opp.estimatedTimeSaved}h/month saved</span>
          <span style="color:#475569;font-size:13px;">Effort: ${opp.effort}</span>
          ${opp.tools.map((t) => `<span style="background:#0f172a;color:#64748b;padding:2px 8px;border-radius:4px;font-size:12px;">${t}</span>`).join("")}
        </div>
      </div>`
    )
    .join("");

  const roadmapHTML = analysis.implementationRoadmap
    .map(
      (phase) => `
      <div style="border-left:3px solid #7c3aed;padding-left:24px;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <span style="background:#7c3aed;color:#fff;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">${phase.phase}</span>
          <div>
            <h4 style="color:#e2e8f0;font-size:16px;font-weight:600;margin:0;">${phase.title}</h4>
            <span style="color:#64748b;font-size:13px;">${phase.duration}</span>
          </div>
        </div>
        <ul style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0 0 8px;padding-left:20px;">
          ${phase.actions.map((a) => `<li>${a}</li>`).join("")}
        </ul>
        <p style="color:#7c3aed;font-size:13px;font-weight:500;margin:0;">→ ${phase.expectedOutcome}</p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Optimization Report — ${businessName}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:700px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);display:inline-block;padding:12px 28px;border-radius:8px;margin-bottom:20px;">
        <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:0.5px;">AURIVA AI</span>
      </div>
      <h1 style="color:#e2e8f0;font-size:28px;font-weight:700;margin:0 0 8px;">AI Optimization Report</h1>
      <p style="color:#64748b;font-size:15px;margin:0;">${businessName} · Prepared for ${leadName}</p>
    </div>

    <!-- Score Card -->
    <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.15));border:1px solid rgba(124,58,237,0.3);border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;">
      <p style="color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Automation Opportunity Score</p>
      <div style="font-size:64px;font-weight:800;color:${scoreColor};line-height:1;">${analysis.qualificationScore}</div>
      <div style="color:#64748b;font-size:14px;margin-top:4px;">out of 100</div>
      <div style="display:flex;justify-content:center;gap:32px;margin-top:20px;flex-wrap:wrap;">
        <div><div style="color:#e2e8f0;font-size:22px;font-weight:700;">${analysis.estimatedROI.monthlyHoursSaved}h</div><div style="color:#64748b;font-size:12px;">Hours Saved/Month</div></div>
        <div><div style="color:#e2e8f0;font-size:22px;font-weight:700;">$${(analysis.estimatedROI.estimatedAnnualSavings / 1000).toFixed(0)}k</div><div style="color:#64748b;font-size:12px;">Est. Annual Savings</div></div>
        <div><div style="color:#e2e8f0;font-size:22px;font-weight:700;">${analysis.opportunities.length}</div><div style="color:#64748b;font-size:12px;">Opportunities Found</div></div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e2e8f0;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">Executive Summary</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0;white-space:pre-line;">${analysis.executiveSummary}</p>
    </div>

    <!-- Automation Opportunities -->
    <div style="margin-bottom:24px;">
      <h2 style="color:#e2e8f0;font-size:18px;font-weight:700;margin:0 0 16px;">🚀 Automation Opportunities</h2>
      ${opportunitiesHTML}
    </div>

    <!-- ROI Summary -->
    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#e2e8f0;font-size:18px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">💰 ROI Estimate</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#0f172a;border-radius:8px;padding:16px;">
          <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Monthly Time Saved</div>
          <div style="color:#7c3aed;font-size:24px;font-weight:700;">${analysis.estimatedROI.monthlyHoursSaved} hours</div>
        </div>
        <div style="background:#0f172a;border-radius:8px;padding:16px;">
          <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Monthly Savings</div>
          <div style="color:#22c55e;font-size:24px;font-weight:700;">$${analysis.estimatedROI.estimatedMonthlySavings.toLocaleString()}</div>
        </div>
        <div style="background:#0f172a;border-radius:8px;padding:16px;">
          <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Annual Savings</div>
          <div style="color:#22c55e;font-size:24px;font-weight:700;">$${analysis.estimatedROI.estimatedAnnualSavings.toLocaleString()}</div>
        </div>
        <div style="background:#0f172a;border-radius:8px;padding:16px;">
          <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Payback Period</div>
          <div style="color:#f59e0b;font-size:24px;font-weight:700;">${analysis.estimatedROI.paybackPeriod}</div>
        </div>
      </div>
    </div>

    <!-- Implementation Roadmap -->
    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:32px;">
      <h2 style="color:#e2e8f0;font-size:18px;font-weight:700;margin:0 0 20px;padding-bottom:12px;border-bottom:1px solid #1e293b;">🗺️ Implementation Roadmap</h2>
      ${roadmapHTML}
    </div>

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2));border:1px solid rgba(124,58,237,0.4);border-radius:16px;padding:32px;text-align:center;">
      <h3 style="color:#e2e8f0;font-size:20px;font-weight:700;margin:0 0 12px;">Ready to implement these changes?</h3>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">Schedule a free 30-minute consultation with our AI automation specialists to build your custom implementation plan.</p>
      <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}" style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">Schedule Free Consultation</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #1e293b;">
      <p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} Auriva AI · This report was generated by AI and reviewed for accuracy.</p>
    </div>
  </div>
</body>
</html>`;
}
