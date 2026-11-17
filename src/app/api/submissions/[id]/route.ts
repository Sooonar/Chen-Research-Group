import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { labelOf, writeLog } from "@/lib/audit";
import { achievementTypeLabels, reviewStatusLabels } from "@/lib/log-labels";

/** 取提交对应的成果名称，用于日志里的对象快照。 */
async function getTargetLabel(type: string, targetId: string): Promise<string> {
  switch (type) {
    case "PUBLICATION": {
      const row = await prisma.publication.findUnique({
        where: { id: targetId },
        select: { title: true },
      });
      return row?.title ?? "";
    }
    case "PATENT": {
      const row = await prisma.patent.findUnique({
        where: { id: targetId },
        select: { name: true },
      });
      return row?.name ?? "";
    }
    case "COPYRIGHT": {
      const row = await prisma.softwareCopyright.findUnique({
        where: { id: targetId },
        select: { name: true },
      });
      return row?.name ?? "";
    }
    case "AWARD": {
      const row = await prisma.award.findUnique({
        where: { id: targetId },
        select: { name: true },
      });
      return row?.name ?? "";
    }
    default:
      return "";
  }
}

// PUT /api/submissions/[id] - 审核提交（通过/拒绝）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 检查权限
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, reviewNote } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    const before = await prisma.achievement.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "提交不存在" }, { status: 404 });
    }

    // 更新提交状态
    const submission = await prisma.achievement.update({
      where: { id },
      data: {
        status,
        reviewerId: currentUser.id,
        reviewNote,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 如果通过审核，更新对应成果的状态
    if (status === "APPROVED") {
      switch (submission.type) {
        case "PUBLICATION":
          await prisma.publication.update({
            where: { id: submission.targetId },
            data: { status: "APPROVED" },
          });
          break;
        case "PATENT":
          await prisma.patent.update({
            where: { id: submission.targetId },
            data: { reviewStatus: "APPROVED" },
          });
          break;
        case "COPYRIGHT":
          await prisma.softwareCopyright.update({
            where: { id: submission.targetId },
            data: { reviewStatus: "APPROVED" },
          });
          break;
        case "AWARD":
          await prisma.award.update({
            where: { id: submission.targetId },
            data: { reviewStatus: "APPROVED" },
          });
          break;
      }
    }

    const typeLabel = achievementTypeLabels[submission.type] ?? "成果";
    const targetLabel = await getTargetLabel(submission.type, submission.targetId);
    const approved = status === "APPROVED";
    await writeLog({
      request,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      action: "REVIEW",
      module: "submission",
      targetId: submission.id,
      targetLabel,
      summary: `${approved ? "审核通过" : "驳回"}${typeLabel}「${targetLabel}」`,
      changes: [
        {
          field: "status",
          label: "审核状态",
          before: labelOf(reviewStatusLabels, before.status),
          after: labelOf(reviewStatusLabels, status),
        },
        ...(reviewNote
          ? [{ field: "reviewNote", label: "审核意见", before: "", after: reviewNote }]
          : []),
      ],
      detail: reviewNote || null,
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error reviewing submission:", error);
    return NextResponse.json({ error: "审核失败" }, { status: 500 });
  }
}

// DELETE /api/submissions/[id] - 删除提交
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { id } = await params;

    // 获取提交信息
    const submission = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "提交不存在" }, { status: 404 });
    }

    const targetLabel = await getTargetLabel(submission.type, submission.targetId);
    const typeLabel = achievementTypeLabels[submission.type] ?? "成果";

    // 只有提交者本人或管理员可以删除
    if (
      submission.userId !== currentUser.id &&
      currentUser.role !== "SUPER_ADMIN" &&
      currentUser.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    // 删除对应的成果记录
    switch (submission.type) {
      case "PUBLICATION":
        await prisma.publication.delete({ where: { id: submission.targetId } }).catch(() => {});
        break;
      case "PATENT":
        await prisma.patent.delete({ where: { id: submission.targetId } }).catch(() => {});
        break;
      case "COPYRIGHT":
        await prisma.softwareCopyright.delete({ where: { id: submission.targetId } }).catch(() => {});
        break;
      case "AWARD":
        await prisma.award.delete({ where: { id: submission.targetId } }).catch(() => {});
        break;
    }

    // 删除提交记录
    await prisma.achievement.delete({ where: { id } });

    await writeLog({
      request,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      action: "DELETE",
      module: "submission",
      targetId: id,
      targetLabel,
      summary: `删除${typeLabel}提交「${targetLabel}」`,
      changes: [
        {
          field: "status",
          label: "审核状态",
          before: labelOf(reviewStatusLabels, submission.status),
          after: "",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
