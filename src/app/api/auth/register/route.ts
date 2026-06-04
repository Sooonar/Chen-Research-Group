import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 简单的内存速率限制（生产环境建议使用Redis）
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);

  if (!limit || now > limit.resetTime) {
    // 重置：每小时最多5次注册
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

// 输入验证和清理
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/['";\\]/g, "")
    .trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateName(name: string): boolean {
  const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
}

function validateStudentId(studentId: string): boolean {
  const idRegex = /^[a-zA-Z0-9]{3,20}$/;
  return idRegex.test(studentId);
}

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    // 获取客户端IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // 检查速率限制
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "注册请求过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const body = await request.json();
    let { name, email, password, studentId, title, grade } = body;

    // 验证必填项
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "姓名、邮箱和密码为必填项" },
        { status: 400 }
      );
    }

    // 清理输入
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();
    if (studentId) studentId = sanitizeInput(studentId);

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      );
    }

    // 验证姓名格式
    if (!validateName(name)) {
      return NextResponse.json(
        { error: "姓名只能包含中文、英文字母和空格，长度2-50字符" },
        { status: 400 }
      );
    }

    // 验证学号格式（如果提供）
    if (studentId && !validateStudentId(studentId)) {
      return NextResponse.json(
        { error: "学号/工号只能包含字母和数字，长度3-20字符" },
        { status: 400 }
      );
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度至少6位" },
        { status: 400 }
      );
    }

    // 验证身份类型
    const validTitles = ["TEACHER", "MASTER"];
    if (title && !validTitles.includes(title)) {
      return NextResponse.json(
        { error: "身份类型无效" },
        { status: 400 }
      );
    }

    // 验证年级
    if (title === "MASTER" && grade) {
      const gradeNum = parseInt(grade.toString());
      if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 3) {
        return NextResponse.json(
          { error: "年级必须是1-3之间的数字" },
          { status: 400 }
        );
      }
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
        studentId: studentId || null,
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
