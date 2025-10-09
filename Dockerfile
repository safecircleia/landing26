# syntax=docker/dockerfile:1

# Dependencies stage
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on pnpm
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder

# Accept build args from GitHub Actions
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG NODE_ENV
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CMS_URL
ARG SITEMAP_URL
ARG NEXT_PUBLIC_NEWSLETTER_FORM_ID
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PRIVATE_TURNSTILE_SECRET_KEY
ARG RESEND_AUDIENCE_ID
ARG RESEND_API_KEY

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables from build args
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CMS_URL=$NEXT_PUBLIC_CMS_URL
ENV SITEMAP_URL=$SITEMAP_URL
ENV NEXT_PUBLIC_NEWSLETTER_FORM_ID=$NEXT_PUBLIC_NEWSLETTER_FORM_ID
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PRIVATE_TURNSTILE_SECRET_KEY=$NEXT_PRIVATE_TURNSTILE_SECRET_KEY
ENV RESEND_AUDIENCE_ID=$RESEND_AUDIENCE_ID
ENV RESEND_API_KEY=$RESEND_API_KEY

# Set additional build environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN corepack enable pnpm && pnpm build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copy the standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]