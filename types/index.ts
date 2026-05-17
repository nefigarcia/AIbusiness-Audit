export type { Lead, AuditSession, CallTranscript, AIReport, FollowUpTask, ActivityLog, User } from "@prisma/client";
export { LeadStatus, Industry, CompanySize, SessionStatus, Priority, UserRole } from "@prisma/client";

export interface AuditFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  companySize: string;
  mainChallenge: string;
}

export interface AuditSubmitResult {
  success: boolean;
  sessionId?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ReportBottleneck {
  area: string;
  description: string;
  severity: "high" | "medium" | "low";
  estimatedHoursLost: number;
}

export interface AutomationOpportunity {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  estimatedTimeSaved: number;
  tools: string[];
}

export interface ROIEstimate {
  monthlyHoursSaved: number;
  annualHoursSaved: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  implementationCost: string;
  paybackPeriod: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  actions: string[];
  expectedOutcome: string;
}

export interface RecommendedSystem {
  name: string;
  category: string;
  description: string;
  useCase: string;
}

export interface AnalysisResult {
  executiveSummary: string;
  bottlenecks: ReportBottleneck[];
  opportunities: AutomationOpportunity[];
  estimatedROI: ROIEstimate;
  implementationRoadmap: RoadmapPhase[];
  recommendedSystems: RecommendedSystem[];
  qualificationScore: number;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  completedAudits: number;
  reportsGenerated: number;
  convertedLeads: number;
  avgQualificationScore: number;
}
