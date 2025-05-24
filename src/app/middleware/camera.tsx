import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function camera(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has already been through permission check
  const hasCheckedPermission = request.cookies.get('camera_permission_checked');
  
  if (!hasCheckedPermission) {
    // Redirect to permission check page if not checked yet
    const url = request.nextUrl.clone();
    url.pathname = '/welcome';
    url.searchParams.set('redirect', pathname);
    
    const response = NextResponse.redirect(url);
    
    // Set a temporary cookie to prevent redirect loops
    response.cookies.set('redirect_after_permission', pathname, {
      maxAge: 300, // 5 minutes
      path: '/',
    });
    
    return response;
  }
  
  return NextResponse.next();
}
