"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Phone, Mail, Building, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitAuditAction } from "@/actions/audit";
import type { AuditSubmitResult } from "@/types";

const initialState: AuditSubmitResult = { success: false };

const industries = [
  { value: "HEALTHCARE", label: "Healthcare / Medical Clinic" },
  { value: "LEGAL", label: "Legal Office / Law Firm" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "CONTRACTOR", label: "Contractor / Trades" },
  { value: "LOCAL_SERVICE", label: "Local Service Business" },
  { value: "OTHER", label: "Other" },
];

const companySizes = [
  { value: "SOLO", label: "Just me (Solo)" },
  { value: "SMALL", label: "2–10 employees" },
  { value: "MEDIUM", label: "11–50 employees" },
  { value: "LARGE", label: "51–200 employees" },
  { value: "ENTERPRISE", label: "200+ employees" },
];

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <p className="mt-1 text-xs text-red-400">{error[0]}</p>;
}

export function AuditForm() {
  const [state, formAction, pending] = useActionState(submitAuditAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.sessionId) {
      router.push(`/audit/success?session=${state.sessionId}`);
    }
  }, [state.success, state.sessionId, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {state.message && !state.success && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              <User className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Your Name
            </label>
            <Input
              name="name"
              placeholder="John Smith"
              autoComplete="name"
              className={state.errors?.name ? "border-red-500/50" : ""}
            />
            <FieldError error={state.errors?.name} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              <Building className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Business Name
            </label>
            <Input
              name="businessName"
              placeholder="Acme Plumbing Co."
              autoComplete="organization"
              className={state.errors?.businessName ? "border-red-500/50" : ""}
            />
            <FieldError error={state.errors?.businessName} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              <Mail className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="john@acmeplumbing.com"
              autoComplete="email"
              className={state.errors?.email ? "border-red-500/50" : ""}
            />
            <FieldError error={state.errors?.email} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              <Phone className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Phone Number
            </label>
            <Input
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className={state.errors?.phone ? "border-red-500/50" : ""}
            />
            <FieldError error={state.errors?.phone} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Industry
            </label>
            <select
              name="industry"
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:border-white/20 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 appearance-none"
              defaultValue=""
            >
              <option value="" disabled className="bg-[#0f172a] text-white/40">
                Select your industry
              </option>
              {industries.map((ind) => (
                <option key={ind.value} value={ind.value} className="bg-[#0f172a] text-white">
                  {ind.label}
                </option>
              ))}
            </select>
            <FieldError error={state.errors?.industry} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Company Size
            </label>
            <select
              name="companySize"
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:border-white/20 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 appearance-none"
              defaultValue=""
            >
              <option value="" disabled className="bg-[#0f172a] text-white/40">
                Select company size
              </option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value} className="bg-[#0f172a] text-white">
                  {size.label}
                </option>
              ))}
            </select>
            <FieldError error={state.errors?.companySize} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Biggest Operational Challenge
          </label>
          <textarea
            name="mainChallenge"
            rows={4}
            placeholder="Describe your biggest operational challenge or bottleneck. What's costing you the most time or money right now?"
            className="flex w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors hover:border-white/20 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
          />
          <FieldError error={state.errors?.mainChallenge} />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scheduling Your Audit…
            </>
          ) : (
            <>
              Start My Free AI Audit
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-white/30">
          Our AI agent will call your phone number within minutes. No credit card required.
        </p>
      </form>
    </motion.div>
  );
}
