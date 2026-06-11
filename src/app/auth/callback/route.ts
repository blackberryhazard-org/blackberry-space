import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  // Resolve absolute origin from headers or APP_URL since node server runs on localhost inside container
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  let redirectOrigin = origin;
  if (forwardedHost) {
    redirectOrigin = `${forwardedProto}://${forwardedHost}`;
  } else if (process.env.APP_URL) {
    redirectOrigin = process.env.APP_URL;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    }
    console.error('Auth code exchange error:', error);
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${redirectOrigin}/?error=auth-code-error`);
}
