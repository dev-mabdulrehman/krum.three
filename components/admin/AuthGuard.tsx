'use client';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	// Middleware already redirects unauthenticated users on the server before page loads
	return <>{children}</>;
}
