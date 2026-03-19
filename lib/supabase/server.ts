import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createMockClient } from '@/lib/mock/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createClient(): Promise<any> {
  if (process.env.USE_MOCK === 'true') {
    return createMockClient()
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

