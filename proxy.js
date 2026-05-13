import { NextResponse } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth'

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'

  // On laisse passer la page de login
  if (isLoginPage) return NextResponse.next()

  // Pour toute autre route admin, vérifier la signature du JWT
  const token = request.cookies.get(COOKIE_NAME)?.value
  const payload = await verifySessionToken(token)

  if (!payload || payload.role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    if (pathname !== '/admin') url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
