"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function VoiceWave() {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-violet-600 to-blue-400"
          animate={{
            scaleY: [0.3, 1, 0.3],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-400 text-xs font-semibold tracking-wide uppercase">
                AI-Powered Business Audit
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Discover how AI can save your business{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                10–40 hours
              </span>{" "}
              per week.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl"
            >
              Get a free AI-powered business audit and receive a personalized
              automation plan — delivered in under 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="xl" asChild>
                <Link href="/audit">
                  Start Free Audit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="secondary" asChild>
                <a href="#demo">
                  <Phone className="w-4 h-4" />
                  Hear a Demo Call
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 mt-10"
            >
              {[
                ["500+", "Audits Completed"],
                ["38h", "Avg Hours Saved/Week"],
                ["100%", "Free — No Commitment"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[480px]">
              {/* Main card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#111827] to-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">AI Auditor</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">Live call in progress</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { role: "AI", text: "How do you currently handle incoming leads?" },
                    { role: "Lead", text: "Mostly through phone calls, but we miss a lot..." },
                    { role: "AI", text: "I see an opportunity for AI-powered lead capture here." },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === "AI" ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.3 }}
                      className={`flex gap-2 ${msg.role === "Lead" ? "justify-end" : ""}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs ${
                          msg.role === "AI"
                            ? "bg-violet-500/20 text-violet-200 border border-violet-500/20"
                            : "bg-white/10 text-white/80 border border-white/10"
                        }`}
                      >
                        <div className="font-semibold mb-0.5 text-[10px] opacity-60">
                          {msg.role}
                        </div>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <VoiceWave />
                  <div className="text-xs text-white/40">AI is speaking…</div>
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard className="-top-6 -right-6" delay={0.9}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">Report Ready</div>
                    <div className="text-white/40 text-[10px]">3 automations found</div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard className="-bottom-4 -left-6" delay={1.1}>
                <div className="text-xs text-white/60 mb-1">Est. ROI</div>
                <div className="text-xl font-bold text-green-400">$42k/yr</div>
              </FloatingCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
