import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { writeLog } from "@/lib/audit";
import { settingKeyLabels } from "@/lib/log-labels";

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "获取设置失败" }, { status: 500 });
  }
}

// PUT /api/settings - 批量更新设置
export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const body = await request.json();
    const settings = body.settings as Array<{ key: string; value: string }>;
    const keys = settings.map((setting) => setting.key);

    const existing = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });
    const existingMap = new Map(existing.map((item) => [item.key, item.value]));

    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    }

    // 只记录真正发生变化的配置项，值可能是长文本，交由 writeLog 统一截断
    const changes = settings
      .filter((setting) => (existingMap.get(setting.key) ?? "") !== setting.value)
      .map((setting) => ({
        field: setting.key,
        label: settingKeyLabels[setting.key] ?? setting.key,
        before: existingMap.get(setting.key) ?? "",
        after: setting.value,
      }));

    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "setting",
        targetLabel: "网站设置",
        summary: `修改网站设置（${changes.length} 项）`,
        changes,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "更新设置失败" }, { status: 500 });
  }
}
