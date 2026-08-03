import { NextRequest, NextResponse } from 'next/server'

const failedAuthAttempts = new Map<string, { count: number; resetAt: number }>()

function adminClientKey(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
}

async function safeEqual(left: string, right: string) {
  const encoder = new TextEncoder()
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ])
  const a = new Uint8Array(leftHash)
  const b = new Uint8Array(rightHash)
  let difference = 0
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i]
  return difference === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the request is for the admin dashboard
  if (pathname.startsWith('/hcp-bo-7x9k2m') || pathname.startsWith('/api/hcp-bo-7x9k2m')) {
    const now = Date.now()
    if (failedAuthAttempts.size > 10_000) failedAuthAttempts.clear()
    const clientKey = adminClientKey(req)
    const attempts = failedAuthAttempts.get(clientKey)
    if (attempts && attempts.resetAt > now && attempts.count >= 10) {
      return new NextResponse('Trop de tentatives', {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((attempts.resetAt - now) / 1000)) },
      })
    }
    if (attempts && attempts.resetAt <= now) failedAuthAttempts.delete(clientKey)

    const basicAuth = req.headers.get('authorization')

    const validUser = process.env.ADMIN_USER
    const validPass = process.env.ADMIN_PASSWORD

    if (!validUser || !validPass) {
      return new NextResponse('Administration non configurée', { status: 503 })
    }

    if (basicAuth?.startsWith('Basic ')) {
      try {
        const decoded = atob(basicAuth.slice(6))
        const separator = decoded.indexOf(':')
        const user = separator > 0 ? decoded.slice(0, separator) : ''
        const pwd = separator > 0 ? decoded.slice(separator + 1) : ''

        if (await safeEqual(user, validUser) && await safeEqual(pwd, validPass)) {
          failedAuthAttempts.delete(clientKey)
          const response = NextResponse.next()
          response.headers.set('Cache-Control', 'private, no-store, max-age=0')
          response.headers.set('Pragma', 'no-cache')
          return response
        }
      } catch {
        // Invalid base64 credentials are rejected below.
      }
    }

    const current = failedAuthAttempts.get(clientKey)
    failedAuthAttempts.set(clientKey, {
      count: (current?.count || 0) + 1,
      resetAt: current?.resetAt && current.resetAt > now ? current.resetAt : now + 10 * 60_000,
    })

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
  matcher: ['/hcp-bo-7x9k2m/:path*', '/api/hcp-bo-7x9k2m/:path*'],
}

