import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function prevent_reauth_middleware(request: NextRequest) {
    const hasToken = request.cookies.get('token');

    if (hasToken) {
        const referer = request.headers.get('referer');
        if (referer) {
            return NextResponse.redirect(referer);
        } else {
            const url = request.nextUrl.clone();
            url.pathname = '/home';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
