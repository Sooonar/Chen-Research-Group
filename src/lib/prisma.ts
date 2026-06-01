import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function parseDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    "mysql://root:@localhost:3306/group_website";

  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    port: Number(url.port || 3306),
  };
}

function createPrismaClient() {
  const adapter = new PrismaMariaDb(parseDatabaseUrl());

  return new PrismaClient({
    adapter,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}