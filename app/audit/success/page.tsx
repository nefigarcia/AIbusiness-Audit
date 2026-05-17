import Link from "next/link";
import { CheckCircle, Phone, Mail, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Scheduled — Auriva AI",
};

export default function AuditSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">
            Auriva<span className="text-violet-400"> AI</span>
          </span>
        </Link>

        <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Your audit is scheduled!
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8">
          Our AI auditor will call you in the next few minutes. Keep your phone handy — the conversation takes 10–15 minutes.
        </p>

        <div className="bg-[#0f1625] border border-white/8 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h2 className="text-white font-semibold text-sm mb-4">What happens next:</h2>
          {[
            {
              icon: Phone,
              step: "1",
              title: "AI calls your phone",
              desc: "Within the next few minutes",
              color: "text-violet-400",
              bg: "bg-violet-500/15",
            },
            {
              icon: Mail,
              step: "2",
              title: "Check your inbox",
              desc: "Confirmation email sent to your address",
              color: "text-blue-400",
              bg: "bg-blue-500/15",
            },
            {
              icon: Calendar,
              step: "3",
              title: "Receive your report",
              desc: "AI optimization report delivered within 24 hours",
              color: "text-cyan-400",
              bg: "bg-cyan-500/15",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{item.title}</div>
                <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
