FROM node:22-bookworm-slim AS deps

WORKDIR /app

# slim 镜像不带 OpenSSL，Prisma 需要它（否则会警告并回退到默认版本）
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi


FROM node:22-bookworm-slim AS builder

WORKDIR /app

# slim 镜像不带 OpenSSL，Prisma 需要它（否则会警告并回退到默认版本）
RUN apt-get update -y && apt-get install -y openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

# slim 镜像不带 OpenSSL，deploy.sh 里的 prisma db push 在 runner 镜像中执行，同样需要
RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]