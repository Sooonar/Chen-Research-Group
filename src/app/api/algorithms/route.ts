import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, writeLog } from "@/lib/audit";

// GET /api/algorithms
export async function GET() {
  try {
    const algorithms = await prisma.algorithm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(algorithms);
  } catch (error) {
    console.error("Error fetching algorithms:", error);
    return NextResponse.json({ error: "获取算法失败" }, { status: 500 });
  }
}

// POST /api/algorithms
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const body = await request.json();
    const { name, description, useCases, readmeContent } = body;

    const algorithm = await prisma.algorithm.create({
      data: {
        name,
        description,
        useCases,
        readmeContent,
      },
    });

    await writeLog({
      request,
      actor,
      action: "CREATE",
      module: "algorithm",
      targetId: algorithm.id,
      targetLabel: algorithm.name,
      summary: describeLog("CREATE", "algorithm", algorithm.name),
    });

    return NextResponse.json(algorithm, { status: 201 });
  } catch (error) {
    console.error("Error creating algorithm:", error);
    return NextResponse.json({ error: "创建算法失败" }, { status: 500 });
  }
}
