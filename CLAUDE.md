# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Location

The Next.js application lives in `grupo-msm-ugc/`. All commands below must be run from that directory.

## Commands

```bash
cd grupo-msm-ugc

npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build (ESLint errors are ignored during build)
npm run lint     # ESLint check
npm start        # Start production server
```

## Architecture Overview

This is a **UGC (User-Generated Content) creator management platform** for a Colombian ecommerce brand. It manages the full creator lifecycle: registration → contract → product order → video submission → Meta Ads campaign → CPA evaluation.

### Two user surfaces
- **Admin dashboard** (`/dashboard`, `/pipeline`, `/analytics`, `/settings`) — protected by Supabase auth
- **Creator portal** (`/ugc/[id]`) — creators sign contracts, view briefs, submit video Drive links

### Request flow for a new creator
1. Admin POSTs `/api/ugcs` → creator row inserted, contract generated, MasterShop order created, WhatsApp sent
2. Creator signs at `/ugc/[id]/contract` → POST `/api/contracts/sign`
3. MasterShop webhook fires `POST /api/webhooks/mastershop` on delivery → WhatsApp brief sent
4. Creator submits video URL → `POST /api/videos/submit`
5. Admin links Meta ad → campaigns synced, CPA evaluated (threshold in `settings` table, default $25,000 COP)

### Mock mode
`.env.local` sets `USE_MOCK=true`. In this mode:
- Middleware skips auth entirely
- All Supabase calls go to `lib/mock/client.ts` (in-memory store)
- Toggle real services by setting `USE_MOCK=false` and filling in real credentials

### Key environment variables
```
USE_MOCK=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
WHATSAPP_API_TOKEN=
WHATSAPP_BUSINESS_ACCOUNT_ID=
MASTERSHOP_API_KEY=
MASTERSHOP_API_URL=
```

### Supabase client selection
- **Server components / API routes**: `lib/supabase/server.ts` → `createClient()` (uses cookies)
- **Client components**: `lib/supabase/client.ts` → `createBrowserClient()`
- **Middleware**: `lib/supabase/middleware.ts` → `updateSession()`
- All three swap to the mock client when `USE_MOCK=true`

### State management
- Server state: TanStack React Query (mutations/queries in components)
- Client UI state: Zustand stores under `lib/` or co-located with features

### Styling
Tailwind CSS v4. Dark theme — primary background `#0A0A0A`, accent cyan `#00D4FF`, accent pink `#FF006E`. Custom fonts loaded via `app/layout.tsx`.

### Database schema
Full schema in `supabase/schema.sql`. Core tables: `ugcs`, `contracts`, `orders`, `videos`, `campaigns`, `notifications`, `briefs`, `settings`. RLS is enabled; service role key bypasses it for admin operations.
