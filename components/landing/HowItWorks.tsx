"use client";

import { motion } from "framer-motion";
import { Phone, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Talk with the AI Auditor",
    description:
      "Our AI voice agent calls you and conducts a 10–15 minute interview about your operations, workflows, and business goals.",
    color: "from-violet-600 to-violet-800",
    glow: "violet",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "We Analyze Your Workflows",
    description:
      "Our AI system analyzes your transcript, identifies inefficiencies, and calculates the true cost of manual processes.",
    color: "from-blue-600 to-blue-800",
    glow: "blue",
  },
  {
    number: "03",
    icon: FileText,
    title: "Receive Your AI Roadmap",
    description:
      "Get a personalized AI optimization report with a phased implementation plan, ROI estimates, and specific tool recommendations.",
    color: "from-cyan-600 to-cyan-800",
    glow: "cyan",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-white/60 text-xs font-semibold tracking-wide uppercase">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From zero to your AI roadmap in{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              24 hours
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            No forms to fill, no consultants to schedule. Just a conversation with our AI — and a comprehensive automation plan waiting in your inbox.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-cyan-500/30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-colors group">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-5xl font-black text-white/[0.04] leading-none mt-1">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
