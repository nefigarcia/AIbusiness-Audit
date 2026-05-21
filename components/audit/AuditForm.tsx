"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Phone, Mail, Building, User, ChevronRight, Check } from "lucide-react";
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

const challenges = [
  { emoji: "📞", label: "Missed calls & leads" },
  { emoji: "⏱", label: "Slow lead response" },
  { emoji: "📅", label: "Manual scheduling" },
  { emoji: "🔁", label: "Repetitive admin tasks" },
  { emoji: "🎧", label: "Customer support overload" },
  { emoji: "📋", label: "Inconsistent follow-ups" },
  { emoji: "💾", label: "No CRM or disorganized data" },
  { emoji: "📉", label: "Losing jobs to competitors" },
];

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <p className="mt-1.5 text-xs text-red-400">{error[0]}</p>;
}

export function AuditForm() {
  const [state, formAction, pending] = useActionState(submitAuditAction, initialState);
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (state.success && state.sessionId) {
      router.push(`/audit/success?session=${state.sessionId}`);
    }
  }, [state.success, state.sessionId, router]);

  function toggleChip(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  const challengeValue = selected.join(", ");

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
        {/* Name + Business */}
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

        {/* Email + Phone */}
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

        {/* Industry + Company size */}
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

        {/* Challenge chips */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Where are you losing the most time or money?
            <span className="ml-2 text-white/30 font-normal text-xs">Select all that apply</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {challenges.map(({ emoji, label }) => {
              const isSelected = selected.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleChip(label)}
                  className={`
                    relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium
                    transition-all duration-150 text-left
                    ${isSelected
                      ? "bg-violet-500/15 border-violet-500/50 text-violet-200"
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
                    }
                  `}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span className="leading-tight">{label}</span>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5">
                      <Check className="w-3 h-3 text-violet-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hidden input carries the value to the server action */}
          <input type="hidden" name="mainChallenge" value={challengeValue} />

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
