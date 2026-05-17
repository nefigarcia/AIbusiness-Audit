import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CALL_SCHEDULED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CALL_IN_PROGRESS: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    CALL_COMPLETED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    REPORT_GENERATED: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    REPORT_SENT: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    CONSULTATION_SCHEDULED: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    CONVERTED: "bg-green-500/20 text-green-400 border-green-500/30",
    LOST: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSecret(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
