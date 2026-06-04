import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// 允许的文件类型
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
// 最大文件大小 2MB
const MAX_SIZE = 2 * 1024 * 1024;

// POST /api/upload/avatar
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "只支持 JPG、PNG、GIF、WebP 格式的图片" },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "文件大小不能超过 2MB" },
        { status: 400 }
      );
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 生成唯一文件名
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");

    // 确保目录存在
    await mkdir(uploadDir, { recursive: true });

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 写入文件
    await writeFile(join(uploadDir, fileName), buffer);

    // 生成访问URL
    const avatarUrl = `/uploads/avatars/${fileName}`;

    // 更新用户头像
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    // 如果有成员记录，也更新成员头像
    const member = await prisma.member.findFirst({
      where: { userId: user.id },
    });

    if (member) {
      await prisma.member.update({
        where: { id: member.id },
        data: { avatarUrl },
      });
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
