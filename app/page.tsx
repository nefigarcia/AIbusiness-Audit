import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PainPoints } from "@/components/landing/PainPoints";
import { Industries } from "@/components/landing/Industries";
import { AuditDemo } from "@/components/landing/AuditDemo";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <PainPoints />
      <Industries />
      <AuditDemo />
      <CTA />
      <Footer />
    </main>
  );
}
