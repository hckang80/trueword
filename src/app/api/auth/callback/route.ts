import { createClient } from '@/shared/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = (await headers()).get('origin');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      console.log({ isLocalEnv, origin, next, forwardedHost });

      return NextResponse.redirect(
        `https://trueword-pnetl0i7u-hckang80s-projects.vercel.app${next}`
      );
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
