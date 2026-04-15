// Middleware untuk NextAuth - simple redirect logic
// Untuk implementasi routing protection, gunakan route-level checks dalam components

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Bisa add custom middleware logic di sini jika diperlukan
  return NextResponse.next();
}

// Specify routes untuk middleware
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
