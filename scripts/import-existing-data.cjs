const fs = require("node:fs");
const crypto = require("node:crypto");
const { loadEnvConfig } = require("@next/env");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
const dbUrl = new URL(databaseUrl);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: dbUrl.hostname,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
    port: Number(dbUrl.port || 3306),
  }),
});

const inputPath = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
if (!inputPath) throw new Error("Usage: node scripts/import-existing-data.cjs <json-path> [--dry-run]");

const source = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const members = source["成员"]?.rows ?? [];
const projects = source["项目"]?.rows ?? [];
const achievements = source["成果"]?.rows ?? [];
const importedAt = new Date().toISOString().slice(0, 10);

function value(row, key) {
  const exact = row[key];
  if (exact !== undefined && exact !== null) return String(exact).trim();
  const found = Object.keys(row).find((name) => name.trim() === key);
  return found ? String(row[found] ?? "").trim() : "";
}

function parseDate(input) {
  if (!input) return null;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseYear(input) {
  const date = parseDate(input);
  return date ? date.getFullYear() : null;
}

function parseNumber(input) {
  if (!input) return null;
  const number = Number(input);
  return Number.isFinite(number) ? number : null;
}

function cleanPersonName(input) {
  return input.replace(/[（(](?:学|外)[）)]/g, "").trim();
}

function firstAuthor(input) {
  return cleanPersonName(input.split(/[,，、]/)[0] || "");
}

function reviewStatus(input) {
  if (input.includes("不通过")) return "REJECTED";
  if (input.includes("提交") || input.includes("暂存")) return "PENDING";
  return "APPROVED";
}

function projectStatus(input) {
  if (input.includes("结题")) return "COMPLETED";
  if (input.includes("研究中") || input.includes("延期")) return "APPROVED";
  return "APPLIED";
}

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
}

function memberData(row, index) {
  const name = value(row, "姓名");
  const entryDate = parseDate(value(row, "入学日期"));
  const entryYear = entryDate?.getFullYear() ?? null;
  const isGraduated = entryYear !== null && entryYear < 2024;
  const grade = !isGraduated && entryYear !== null
    ? Math.min(3, Math.max(1, new Date().getFullYear() - entryYear + 1))
    : null;
  const bio = [
    value(row, "院系") && `院系：${value(row, "院系")}`,
    value(row, "专业") && `专业：${value(row, "专业")}`,
    value(row, "学生类别") && `学生类别：${value(row, "学生类别")}`,
    value(row, "学号") && `学号：${value(row, "学号")}`,
    value(row, "手机号码") && `手机：${value(row, "手机号码")}`,
    value(row, "论文题目") && `论文题目：${value(row, "论文题目")}`,
    entryDate && `入学日期：${value(row, "入学日期")}`,
  ].filter(Boolean).join("；");

  return {
    name,
    title: isGraduated ? "ALUMNI" : "MASTER",
    grade,
    researchDirection: value(row, "专业") || null,
    bio: bio || `数据导入批次：${importedAt}（第 ${index + 1} 条）`,
    email: null,
    avatarUrl: null,
    isGraduated,
    graduationYear: isGraduated && entryYear !== null ? entryYear + 3 : null,
    displayOrder: index,
  };
}

function projectData(row) {
  const category = value(row, "项目分类");
  const nature = value(row, "项目性质");
  const department = value(row, "所属单位");
  const number = value(row, "项目编号");
  const received = value(row, "已到金额");
  const approved = value(row, "批准经费");
  const metadata = [
    nature && `项目性质：${nature}`,
    category && `项目分类：${category}`,
    department && `所属单位：${department}`,
    number && `项目编号：${number}`,
    received && `已到金额：${received} 万元`,
    approved && `批准经费：${approved} 万元`,
  ].filter(Boolean).join("；");

  return {
    name: value(row, "项目名称").replace(/[\t\r\n]+/g, " ").trim(),
    leader: value(row, "负责人姓名"),
    fundingSource: [nature, category].filter(Boolean).join(" / ") || null,
    fundingAmount: parseNumber(approved) ?? parseNumber(received),
    startDate: parseDate(value(row, "立项日期")),
    endDate: null,
    status: projectStatus(value(row, "项目状态")),
    description: metadata || null,
  };
}

async function findMember(tx, name) {
  if (!name) return null;
  return tx.member.findFirst({ where: { name } });
}

async function upsertMember(tx, data) {
  const existing = await tx.member.findFirst({ where: { name: data.name } });
  return existing
    ? tx.member.update({ where: { id: existing.id }, data })
    : tx.member.create({ data });
}

async function upsertProject(tx, data) {
  const existing = await tx.project.findFirst({ where: { name: data.name, leader: data.leader } });
  return existing
    ? tx.project.update({ where: { id: existing.id }, data })
    : tx.project.create({ data });
}

async function importAll(tx) {
  const summary = {
    members: 0,
    projects: 0,
    publications: 0,
    patents: 0,
    copyrights: 0,
    awards: 0,
    competitions: 0,
    skippedStandards: 0,
    projectMemberLinks: 0,
  };
  const memberIds = new Map();
  const projectIds = new Map();

  await tx.project.updateMany({ where: { status: "ONGOING" }, data: { status: "APPLIED" } });
  await tx.project.updateMany({ where: { status: "SUSPENDED" }, data: { status: "APPLIED" } });

  for (let index = 0; index < members.length; index += 1) {
    const data = memberData(members[index], index);
    if (!data.name) continue;
    const member = await upsertMember(tx, data);
    memberIds.set(data.name, member.id);
    summary.members += 1;
  }

  for (const row of projects) {
    const data = projectData(row);
    if (!data.name) continue;
    const project = await upsertProject(tx, data);
    projectIds.set(`${data.name}\u0000${data.leader}`, project.id);
    const leaderId = memberIds.get(cleanPersonName(data.leader));
    if (leaderId) {
      const link = await tx.projectMember.upsert({
        where: { projectId_memberId: { projectId: project.id, memberId: leaderId } },
        update: { role: "负责人" },
        create: { projectId: project.id, memberId: leaderId, role: "负责人" },
      });
      if (link) summary.projectMemberLinks += 1;
    }
    summary.projects += 1;
  }

  for (let index = 0; index < achievements.length; index += 1) {
    const row = achievements[index];
    const type = value(row, "成果类型");
    const name = value(row, "成果名称");
    const date = parseDate(value(row, "成果日期"));
    const year = date?.getFullYear() ?? new Date().getFullYear();
    const authors = value(row, "所有作者（列表使用）") || value(row, "第一作者姓名");
    const submittedBy = memberIds.get(firstAuthor(value(row, "第一作者姓名"))) || null;
    const status = reviewStatus(value(row, "审核状态"));

    if (!name) continue;
    if (type === "论文") {
      const existing = await tx.publication.findFirst({ where: { title: name, year, authors } });
      const data = { title: name, authors, journal: value(row, "所属单位") || "未填写", year, doi: null, abstract: null, status, submittedBy };
      if (existing) await tx.publication.update({ where: { id: existing.id }, data });
      else await tx.publication.create({ data });
      summary.publications += 1;
    } else if (type === "专利") {
      const patentNumber = `IMPORT-${hash(`${name}|${authors}|${value(row, "成果日期")}|${index}`)}`;
      const existing = await tx.patent.findFirst({ where: { name, patentNumber } });
      const data = { name, patentNumber, patentType: "INVENTION", status: "APPLIED", applicationDate: date, authorizationDate: null, inventors: authors, reviewStatus: status, submittedBy };
      if (existing) await tx.patent.update({ where: { id: existing.id }, data });
      else await tx.patent.create({ data });
      summary.patents += 1;
    } else if (type === "著作权") {
      const registrationNumber = `IMPORT-${hash(`${name}|${authors}|${value(row, "成果日期")}|${index}`)}`;
      const existing = await tx.softwareCopyright.findFirst({ where: { name, registrationNumber } });
      const data = { name, registrationNumber, version: null, registrationDate: date, reviewStatus: status, submittedBy };
      if (existing) await tx.softwareCopyright.update({ where: { id: existing.id }, data });
      else await tx.softwareCopyright.create({ data });
      summary.copyrights += 1;
    } else if (type === "获奖") {
      const competition = value(row, "所属单位") || "未填写";
      const existingAward = await tx.award.findFirst({ where: { name, year, winners: authors } });
      const awardData = { name, competition, level: "OTHER", winners: authors, year, description: `数据导入审核状态：${value(row, "审核状态") || "未填写"}`, imageUrl: null, reviewStatus: status, submittedBy };
      const award = existingAward
        ? await tx.award.update({ where: { id: existingAward.id }, data: awardData })
        : await tx.award.create({ data: awardData });

      const existingCompetition = await tx.competition.findFirst({ where: { name, year, participants: authors } });
      const competitionData = { name, organizer: competition, year, result: "WON", participants: authors, awardLevel: "OTHER", description: awardData.description, imageUrl: null, projectId: null, awardId: award.id };
      if (existingCompetition) await tx.competition.update({ where: { id: existingCompetition.id }, data: competitionData });
      else await tx.competition.create({ data: competitionData });
      summary.awards += 1;
      summary.competitions += 1;
    } else if (type === "标准") {
      summary.skippedStandards += 1;
    }
  }

  return summary;
}

async function main() {
  if (dryRun) {
    const summary = { members: members.length, projects: projects.length, achievements: achievements.length, supportedAchievements: achievements.filter((row) => ["论文", "专利", "著作权", "获奖"].includes(value(row, "成果类型"))).length, skippedStandards: achievements.filter((row) => value(row, "成果类型") === "标准").length };
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const summary = await prisma.$transaction((tx) => importAll(tx), { timeout: 120000 });
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
