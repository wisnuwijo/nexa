import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function auth_middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasToken = request.cookies.get('token');
  
  if (!hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    
    const response = NextResponse.redirect(url);
    return response;
  }
  
  return NextResponse.next();
}
