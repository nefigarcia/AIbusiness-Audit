import { prisma } from "@/lib/prisma";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leads — Auriva AI" };

interface SearchParams {
  page?: string;
  status?: string;
}

async function getLeads(page: number, status?: string) {
  const limit = 20;
  const where = status ? { status: status as never } : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        auditSessions: {
          include: { report: { select: { qualificationScore: true } } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, pages: Math.ceil(total / limit) };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const { leads, total, pages } = await getLeads(page, params.status);

  const statuses = [
    "NEW", "CALL_SCHEDULED", "CALL_COMPLETED",
    "REPORT_GENERATED", "REPORT_SENT", "CONVERTED", "LOST",
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-white/40 text-sm mt-1">{total} total leads</p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/dashboard/leads"
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            !params.status
              ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
              : "text-white/40 hover:text-white border border-white/10"
          }`}
        >
          All
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/dashboard/leads?status=${s}`}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              params.status === s
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "text-white/40 hover:text-white border border-white/10"
            }`}
          >
            {s.replace(/_/g, " ")}
          </a>
        ))}
      </div>

      <RecentLeads leads={leads} />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/dashboard/leads?page=${p}${params.status ? `&status=${params.status}` : ""}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                p === page
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
