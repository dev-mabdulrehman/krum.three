import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const session = request.cookies.get('session')?.value;
	const { pathname } = request.nextUrl;

	const isAuthPage =
		pathname.startsWith('/admin/login') ||
		pathname.startsWith('/admin/forgot-password');

	const isAdminPage = pathname.startsWith('/admin') && !isAuthPage;

	// 1. Block unauthenticated access to admin routes
	if (isAdminPage && !session) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	// 2. Redirect logged-in users away from login page
	if (isAuthPage && session) {
		return NextResponse.redirect(new URL('/admin/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
