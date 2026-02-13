import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Allow the auth endpoint through without a cookie (it's the login endpoint)
  if (request.nextUrl.pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  // Check for admin session cookie on admin routes
  const adminSession = request.cookies.get('admin_session')?.value

  if (!adminSession) {
    // Allow the request to continue - the admin layout will show password form
    // But for API routes, we need to return 401
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
