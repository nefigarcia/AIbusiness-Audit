"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sampleTranscript = [
  { role: "AI", text: "Hi, this is the AI auditor from Auriva AI. I'm here to conduct your free business audit. Is now a good time to talk?" },
  { role: "Lead", text: "Yes, absolutely. I've been curious about what you might find." },
  { role: "AI", text: "Great! Let's start with leads. How do you currently handle new inquiries and potential customers?" },
  { role: "Lead", text: "Mostly through phone calls. The problem is we miss a lot of them, especially after 5pm or on weekends." },
  { role: "AI", text: "That's a significant gap. How many calls would you estimate you miss in a typical week?" },
  { role: "Lead", text: "Probably 15 to 20 calls per week. Each one could be worth $2,000 to $5,000 in revenue." },
  { role: "AI", text: "So you could be leaving up to $100,000 in potential revenue on the table every week. Let's talk about scheduling next..." },
];

const sampleReport = {
  score: 84,
  summary: "Acme Plumbing has significant automation opportunities across lead capture, scheduling, and customer follow-up. Current manual processes are costing approximately $6,200/month in missed revenue and wasted labor.",
  opportunities: [
    { title: "24/7 AI Lead Capture", impact: "HIGH", timeSaved: "18 hrs/mo", icon: "📞" },
    { title: "Automated Scheduling", impact: "HIGH", timeSaved: "12 hrs/mo", icon: "📅" },
    { title: "Follow-up Sequences", impact: "MEDIUM", timeSaved: "8 hrs/mo", icon: "📧" },
  ],
  roi: { monthly: 6200, annual: 74400 },
};

export function AuditDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [activeTab, setActiveTab] = useState<"transcript" | "report">("transcript");

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setVisibleLines(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= sampleTranscript.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveTab("report");
      }
    }, 1400);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-white/60 text-xs font-semibold tracking-wide uppercase">
              See It In Action
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Watch a real audit{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              unfold
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            See how our AI agent interviews a business, then generates a comprehensive optimization report.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-white/10">
              {[
                { id: "transcript", label: "Audit Call" },
                { id: "report", label: "Generated Report" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "transcript" | "report")}
                  className={`px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-violet-500"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="flex-1 flex items-center justify-end px-4">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? "Pause" : visibleLines > 0 ? "Replay" : "Play Demo"}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "transcript" ? (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 min-h-[400px] space-y-4"
                >
                  {visibleLines === 0 && !isPlaying && (
                    <div className="flex items-center justify-center h-64 text-white/20 text-sm">
                      Press Play to start the demo audit
                    </div>
                  )}
                  {sampleTranscript.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${line.role === "Lead" ? "justify-end" : ""}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
                          line.role === "AI"
                            ? "bg-violet-500/15 text-violet-100 border border-violet-500/20"
                            : "bg-white/8 text-white/80 border border-white/10"
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wide opacity-50 mb-1">
                          {line.role === "AI" ? "Auriva AI Auditor" : "Business Owner"}
                        </div>
                        {line.text}
                      </div>
                    </motion.div>
                  ))}
                  {isPlaying && (
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <span className="text-violet-400 text-xs">AI</span>
                      </div>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="report"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-bold text-lg">AI Optimization Report</h3>
                      <p className="text-white/40 text-sm">Sample Business — Acme Plumbing</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-400">{sampleReport.score}</div>
                      <div className="text-white/40 text-xs">Opportunity Score</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1f2e] rounded-xl p-4 mb-4 text-sm text-white/60 leading-relaxed">
                    {sampleReport.summary}
                  </div>

                  <div className="grid gap-3 mb-4">
                    {sampleReport.opportunities.map((opp, i) => (
                      <motion.div
                        key={opp.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 bg-[#1a1f2e] rounded-xl p-4"
                      >
                        <span className="text-2xl">{opp.icon}</span>
                        <div className="flex-1">
                          <div className="text-white text-sm font-semibold">{opp.title}</div>
                          <div className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {opp.timeSaved} saved
                          </div>
                        </div>
                        <div className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                          {opp.impact}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a1f2e] rounded-xl p-4 text-center">
                      <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <div className="text-green-400 font-bold text-lg">${sampleReport.roi.monthly.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">Monthly Savings Est.</div>
                    </div>
                    <div className="bg-[#1a1f2e] rounded-xl p-4 text-center">
                      <TrendingUp className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                      <div className="text-violet-400 font-bold text-lg">${(sampleReport.roi.annual / 1000).toFixed(0)}k</div>
                      <div className="text-white/40 text-xs">Annual ROI Est.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link href="/audit">
                <CheckCircle className="w-5 h-5" />
                Get Your Real Report — Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
