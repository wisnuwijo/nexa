import { NextRequest, NextResponse } from 'next/server';
import { camera_middleware } from './app/middleware/camera_middleware';
import { auth_middleware } from './app/middleware/auth_middleware';
import { prevent_reauth_middleware } from './app/middleware/prevent_reauth_middleware';

export function middleware(req: NextRequest) {
  const isCameraPermissionRequiredRoute = authPaths.matcher.some(path => req.nextUrl.pathname.startsWith(path));
  const isProtectedRoute = protectedPaths.matcher.some(path => req.nextUrl.pathname.startsWith(path));

  const hasCheckedPermission = req.cookies.get('camera_permission_checked');
  if (!hasCheckedPermission && isCameraPermissionRequiredRoute) {
    return camera_middleware(req);
  }

  if (isCameraPermissionRequiredRoute) {
    return prevent_reauth_middleware(req);
  }

  // extinguisher detail page
  if (req.nextUrl.pathname.startsWith('/extinguisher/d/')) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    return auth_middleware(req);
  }

  return NextResponse.next();
}

export const authPaths = {
  matcher: [
    '/login',
    '/register',
    '/reset_password',
  ]
};

export const protectedPaths = {
  matcher: [
    '/extinguisher',
    '/home',
    '/inspection',
    '/profile',
    '/users'
  ]
};