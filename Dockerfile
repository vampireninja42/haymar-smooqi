FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx prisma generate && npx next build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/.bin/tsx ./node_modules/.bin/tsx
COPY prisma ./prisma
COPY scripts ./scripts
COPY content ./content
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/tsx scripts/import-content.ts && node_modules/.bin/next start -p 3000"]
