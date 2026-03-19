# GRUPO MSM UGC Platform

Plataforma de gestión de creadores UGC para marca colombiana de ecommerce.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (auth, database, storage)
- **Integraciones**: Meta Ads API, WhatsApp Business API, MasterShop

## Setup

### 1. Supabase

1. Crea proyecto en [supabase.com](https://supabase.com)
2. SQL Editor → ejecuta `supabase/schema.sql`
3. Authentication → Settings → habilita Email/Password y Magic Link
4. Crea usuario admin en Authentication → Users

### 2. Variables de entorno

Edita `.env.local` con tus credenciales reales:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
META_ACCESS_TOKEN=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_ACCESS_TOKEN=...
MASTERSHOP_API_KEY=...
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
CPA_THRESHOLD=25000
```

### 3. Correr localmente

```bash
npm install && npm run dev
```

### 4. Deploy

```bash
vercel --prod
```

## Flujo principal

1. Admin registra creador → contrato generado → WhatsApp enviado
2. Creador firma contrato → admin envía pedido
3. Pedido entregado (webhook MasterShop) → WhatsApp + brief
4. Creador sube video (Google Drive link) → admin sube a Meta Ads
5. Métricas se sincronizan diariamente desde Meta
6. Si CPA < $25,000 COP → "Funcionando" → WhatsApp al creador
7. Si CPA > $25,000 COP → "No funcionó" → opción de reintentar
