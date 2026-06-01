import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, studentId, title, grade } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "姓名、邮箱和密码为必填项" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已注册" },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户（默认待审核状态）
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        studentId,
        title: title || "MASTER",
        grade: grade ? parseInt(grade.toString()) : null,
        status: "PENDING",
        role: "MEMBER",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "注册成功，请等待管理员审核",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
