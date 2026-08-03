FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS builder
WORKDIR /app
COPY . .

# NEXT_PUBLIC_* values are embedded into the browser bundle at build time.
ARG NEXT_PUBLIC_RETENTIONMAX_WHATSAPP
ENV NEXT_PUBLIC_RETENTIONMAX_WHATSAPP=$NEXT_PUBLIC_RETENTIONMAX_WHATSAPP

RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs appuser

COPY --from=builder --chown=appuser:nodejs /app/dist/standalone ./

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "server.js"]
