import { NextRequest, NextResponse } from 'next/server';
import { camera } from './app/middleware/camera';

export function middleware(req: NextRequest) {
  const isProtectedRoute = ['/login', '/register'].includes(req.nextUrl.pathname);
  
  if (isProtectedRoute) {
    return camera(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/login/',
    '/register',
    '/register/'
  ]
};