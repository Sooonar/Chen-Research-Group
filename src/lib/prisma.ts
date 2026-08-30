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
    // MySQL 8 默认认证插件 caching_sha2_password 在非 TLS 连接下需要获取 RSA 公钥。
    // 否则服务端认证缓存失效后（如 MySQL 重启），所有新连接都会失败，
    // 表现为连接池超时（pool timeout）。见 mariadb 驱动的 allowPublicKeyRetrieval 选项。
    allowPublicKeyRetrieval: true,
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