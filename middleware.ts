import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the request is for the admin dashboard
  if (pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      const validUser = process.env.ADMIN_USER || 'admin'
      const validPass = process.env.ADMIN_PASSWORD || 'password123'

      if (user === validUser && pwd === validPass) {
        return NextResponse.next()
      }
    }

    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
