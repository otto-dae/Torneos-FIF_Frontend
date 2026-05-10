import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;

    if (path === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isAdminOnly =
        path.startsWith('/dashboard/tournaments/create') ||
        path.startsWith('/dashboard/teams/create') ||
        path.startsWith('/dashboard/administrators') ||
        path.startsWith('/dashboard/teams/') && path.includes('/participants/create') ||
        /^\/dashboard\/matches\/\d+\/update/.test(path) ||
        /^\/dashboard\/phase-matches\/\d+\/update/.test(path);

    if (isAdminOnly && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};