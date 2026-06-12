import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // ✅ Use location.replace() instead of 302 redirect.
  // This replaces the callback URL in history rather than pushing a new entry,
  // so pressing Back can never land on /auth/callback?code=...
  return new NextResponse(
    `<html><head>
      <script>window.location.replace('${origin}/');</script>
    </head><body></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}