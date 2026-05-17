import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">
              Auriva<span className="text-violet-400"> AI</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#industries" className="hover:text-white transition-colors">
              Industries
            </a>
            <Link href="/audit" className="hover:text-white transition-colors">
              Free Audit
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
          </nav>

          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} Auriva AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
