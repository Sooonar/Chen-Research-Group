import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  deriveGrade,
  enrollmentYearFromGrade,
  getAcademicYear,
  MAX_FUTURE_ENROLLMENT_YEARS,
  MIN_ENROLLMENT_YEAR,
  resolveTitleForEnrollment,
  toIntOrNull,
  type MemberTitleLike,
} from "@/lib/member-grade";

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
    // 需要清洗的字段用 let，其余只读
    let { name, email, studentId } = body;
    const { password, title, grade, enrollmentYear } = body;

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

    // 验证身份类型（已毕业校友也可以自己注册）
    const validTitles = ["TEACHER", "MASTER", "ALUMNI"];
    if (title && !validTitles.includes(title)) {
      return NextResponse.json(
        { error: "身份类型无效" },
        { status: 400 }
      );
    }

    // 按「入学年份」登记，年级由后台按学年自动推算，不再让用户手选「研几」
    let finalGrade: number | null = toIntOrNull(grade);
    let finalEnrollmentYear: number | null = toIntOrNull(enrollmentYear);
    let finalTitle = (title as MemberTitleLike | undefined) || "MASTER";
    const currentAcademicYear = getAcademicYear();

    if (finalTitle === "TEACHER") {
      finalGrade = null;
      finalEnrollmentYear = null;
    } else {
      // 兼容只传 grade 的旧客户端
      if (finalEnrollmentYear === null && finalGrade !== null) {
        finalEnrollmentYear = enrollmentYearFromGrade(finalGrade);
      }
      if (finalEnrollmentYear !== null && finalEnrollmentYear < MIN_ENROLLMENT_YEAR) {
        return NextResponse.json(
          { error: `入学年份不能早于 ${MIN_ENROLLMENT_YEAR} 年` },
          { status: 400 }
        );
      }
      if (finalEnrollmentYear !== null && finalEnrollmentYear > currentAcademicYear + MAX_FUTURE_ENROLLMENT_YEARS) {
        return NextResponse.json(
          { error: `入学年份最多可选到 ${currentAcademicYear + MAX_FUTURE_ENROLLMENT_YEARS} 年` },
          { status: 400 }
        );
      }

      if (finalTitle === "MASTER" && finalEnrollmentYear === null) {
        return NextResponse.json({ error: "请选择入学年份" }, { status: 400 });
      }
      // 按入学年份自动判定：超过 3 年学制直接记为「已毕业」，未来年份记为「预入学」
      finalTitle = resolveTitleForEnrollment(finalTitle, finalEnrollmentYear);
      finalGrade = finalTitle === "MASTER" ? deriveGrade(finalEnrollmentYear) : null;
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
        title: finalTitle,
        grade: finalGrade,
        enrollmentYear: finalEnrollmentYear,
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
