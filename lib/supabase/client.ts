import { createBrowserClient } from '@supabase/ssr'
import { createMockClient } from '@/lib/mock/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  if (
    process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return createMockClient()
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
