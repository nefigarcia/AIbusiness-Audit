"use client";

import { motion } from "framer-motion";
import { Heart, Scale, Home, Wrench, Store } from "lucide-react";

const industries = [
  {
    icon: Heart,
    name: "Healthcare Clinics",
    description: "Automate appointment scheduling, patient intake, follow-up reminders, and insurance verification.",
    automations: ["Appointment booking", "Patient reminders", "Insurance pre-auth", "After-hours triage"],
    color: "from-pink-500/20 to-red-500/20",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/20",
  },
  {
    icon: Wrench,
    name: "Contractors",
    description: "Never miss a lead again. Automate estimates, job scheduling, follow-ups, and customer communications.",
    automations: ["Lead capture 24/7", "Estimate follow-ups", "Job scheduling", "Crew coordination"],
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/20",
  },
  {
    icon: Store,
    name: "Local Service Businesses",
    description: "Handle customer inquiries, bookings, reviews, and loyalty programs on autopilot.",
    automations: ["Booking automation", "Review collection", "Customer re-engagement", "Staff scheduling"],
    color: "from-yellow-500/20 to-green-500/20",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
  },
  {
    icon: Scale,
    name: "Legal Offices",
    description: "Automate client intake, consultation scheduling, document collection, and case updates.",
    automations: ["Client intake", "Consultation scheduling", "Document requests", "Case status updates"],
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
  },
  {
    icon: Home,
    name: "Real Estate",
    description: "Qualify leads automatically, schedule showings, send market reports, and nurture long-term prospects.",
    automations: ["Lead qualification", "Showing scheduler", "Market reports", "Drip campaigns"],
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/20",
  },
];

export function Industries() {
  return (
    <section id="industries" className="py-24 relative">
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
              Industries We Serve
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for businesses that run on{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              operations
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We specialize in high-touch service businesses where automation directly impacts revenue.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-gradient-to-br ${industry.color} border ${industry.border} rounded-2xl p-6 group hover:scale-[1.01] transition-transform`}
            >
              <div className={`w-10 h-10 ${industry.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <industry.icon className={`w-5 h-5 ${industry.iconColor}`} />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{industry.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{industry.description}</p>
              <div className="space-y-1.5">
                {industry.automations.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-xs text-white/40">
                    <div className={`w-1 h-1 rounded-full ${industry.iconColor.replace("text-", "bg-")}`} />
                    {a}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
