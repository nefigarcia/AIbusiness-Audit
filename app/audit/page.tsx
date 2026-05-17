import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { AuditForm } from "@/components/audit/AuditForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Business Audit — Auriva AI",
  description:
    "Request your free AI-powered business audit. Our AI agent will call you and generate a personalized automation roadmap.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link + logo */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">
              Auriva<span className="text-violet-400"> AI</span>
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">
              AI Auditor Available Now
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Request Your Free AI Audit
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Fill in your details and our AI agent will call you within minutes
            for a 10–15 minute business interview.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            ["📞", "AI calls you", "No scheduling needed"],
            ["⚡", "Same day report", "In your inbox"],
            ["🔒", "100% free", "No commitment"],
          ].map(([icon, title, sub]) => (
            <div
              key={title}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-3 text-center"
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-white text-xs font-semibold">{title}</div>
              <div className="text-white/40 text-[11px]">{sub}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-[#0f1625]/80 backdrop-blur border border-white/8 rounded-2xl p-6 sm:p-8">
          <AuditForm />
        </div>
      </div>
    </div>
  );
}
