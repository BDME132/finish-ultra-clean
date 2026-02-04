import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // During build/prerendering, NEXT_PUBLIC_ env vars may not be available.
  // Provide fallback values so the client can be created without throwing.
  // The client won't be used for real API calls during prerendering (only in
  // useEffect/event handlers which don't run during SSR).
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}
