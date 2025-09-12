# ===========================
# 1) Builder
# ===========================
FROM node:20.18.1-slim AS builder

RUN apt-get update -y \
  && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm i styled-jsx

COPY prisma ./prisma
COPY .env .env
COPY .eslintrc.json .eslintrc.json

RUN npx prisma generate

COPY . .

RUN npm run build

# ===========================
# 2) Runner (production)
# ===========================
FROM node:20.18.1-slim AS runner

RUN apt-get update -y \
  && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
