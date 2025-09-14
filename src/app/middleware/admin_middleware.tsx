import { NextRequest, NextResponse } from 'next/server';

export async function admin_middleware(request: NextRequest) {
  const idLevel = request.cookies.get('id_level')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!idLevel) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    if (idLevel != "0") {
      // If not an admin, redirect to the home page
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/extinguisher', request.url));
    }

    // If the user is an admin, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On any error, redirect to login as a fallback
    return NextResponse.redirect(loginUrl);
  }
}
