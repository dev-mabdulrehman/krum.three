import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const authToken = request.cookies.get('admin_session')?.value;
	console.log('Auth Token:', authToken);

	const isAdminRoute = pathname.startsWith('/admin');
	const isAuthRoute =
		pathname.startsWith('/admin/login') ||
		pathname.startsWith('/admin/forgot-password');

	if (isAdminRoute && !isAuthRoute && !authToken) {
		const loginUrl = new URL('/admin/login', request.url);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthRoute && authToken) {
		const dashboardUrl = new URL('/admin/dashboard', request.url);
		return NextResponse.redirect(dashboardUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
