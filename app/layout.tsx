import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Auriva AI — Free AI Business Audit",
    template: "%s — Auriva AI",
  },
  description:
    "Discover how AI can save your business 10–40 hours per week. Get a free AI-powered business audit and receive a personalized automation plan.",
  keywords: ["AI automation", "business audit", "workflow automation", "AI agents", "business efficiency"],
  openGraph: {
    title: "Auriva AI — Free AI Business Audit",
    description: "Get a free AI-powered business audit and a personalized automation roadmap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
