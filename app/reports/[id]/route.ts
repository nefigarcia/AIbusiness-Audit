import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.aIReport.findUnique({
    where: { id },
  });

  if (!report) {
    return new NextResponse("Report not found", { status: 404 });
  }

  return new NextResponse(report.htmlContent, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
