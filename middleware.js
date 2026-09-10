import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isProtectedApiWrite =
    (pathname.startsWith('/api/players') ||
      pathname.startsWith('/api/staff') ||
      pathname.startsWith('/api/matches')) &&
    method !== 'GET';

  if (isAdminPage || isProtectedApiWrite) {
    const cookie = request.cookies.get('admin_session');
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || !cookie || cookie.value !== expected) {
      if (isAdminPage) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/players/:path*', '/api/staff/:path*', '/api/matches/:path*'],
};
