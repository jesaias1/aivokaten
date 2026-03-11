import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware can't check localStorage, so we let the client-side 
  // components handle auth redirects via the AuthContext.
  // This middleware is kept for future server-side auth checks.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
