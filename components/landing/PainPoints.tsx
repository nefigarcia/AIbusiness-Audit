"use client";

import { motion } from "framer-motion";
import {
  PhoneMissed,
  Clock,
  ClipboardList,
  Calendar,
  HeadphonesIcon,
  TrendingDown,
} from "lucide-react";

const pains = [
  {
    icon: PhoneMissed,
    title: "Missed Calls & Leads",
    description:
      "Every unanswered call is a lost customer. Businesses miss 40% of incoming leads after hours.",
    stat: "40% of leads lost",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: Clock,
    title: "Slow Lead Response",
    description:
      "Responding to leads in 5 minutes vs 30 minutes increases conversion by 400%. Speed matters.",
    stat: "400% conversion drop",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: ClipboardList,
    title: "Repetitive Admin Work",
    description:
      "Data entry, status updates, and manual follow-ups consume 30% of your team's productive time.",
    stat: "30% of time wasted",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Calendar,
    title: "Manual Scheduling",
    description:
      "Back-and-forth scheduling emails waste 4+ hours per week per employee. Automation fixes this instantly.",
    stat: "4+ hrs/week lost",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support Overload",
    description:
      "Answering the same 10 questions 100 times per day. AI handles 80% of support queries automatically.",
    stat: "80% automatable",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: TrendingDown,
    title: "Inefficient Follow-ups",
    description:
      "Most businesses give up after 1–2 follow-up attempts. Automated sequences convert 5x more leads.",
    stat: "5x more conversions",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

export function PainPoints() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-red-400 text-xs font-semibold tracking-wide uppercase">
              Business Inefficiencies
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How much is manual work{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              costing you?
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Most businesses lose 20–40 hours per week to tasks that AI can handle automatically.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`${pain.bg} border rounded-2xl p-6 group hover:scale-[1.01] transition-transform cursor-default`}
            >
              <pain.icon className={`w-8 h-8 ${pain.color} mb-4`} />
              <h3 className="text-white font-semibold text-base mb-2">{pain.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {pain.description}
              </p>
              <div className={`text-sm font-bold ${pain.color}`}>{pain.stat}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
