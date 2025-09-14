import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function auth_middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasToken = request.cookies.get('token');
  const idLevel = request.cookies.get('id_level')?.value;

  if (idLevel == "0") {
    // If admin, redirect to the home page
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (!hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    
    const response = NextResponse.redirect(url);
    return response;
  }
  
  return NextResponse.next();
}
