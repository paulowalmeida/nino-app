import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/entrar', '/cadastrar']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/entrar', request.url))
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
