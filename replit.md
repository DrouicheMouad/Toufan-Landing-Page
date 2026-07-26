# تحت راية الطوفان — Book Order

A book order landing page for "تحت راية الطوفان" that lets customers place delivery orders via the Guepex courier API, with seller notifications via Telegram and email.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (pre-configured)
- Required env: `GUEPEX_API_ID` — Guepex courier API ID
- Required env: `GUEPEX_API_TOKEN` — Guepex courier API token
- Optional env: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — order notifications via Telegram
- Optional env: `GMAIL_APP_PASSWORD` — order notifications via email (sender: mouaddrouiche22@gmail.com)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/book-store/` — React + Vite frontend (landing page + order form)
- `artifacts/api-server/` — Express 5 backend (Guepex routes, order creation, notifications)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/api-client-react/` — generated React Query hooks (do not edit by hand)
- `lib/api-zod/` — generated Zod schemas used by the server (do not edit by hand)
- `lib/db/src/schema/orders.ts` — Drizzle DB schema

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
