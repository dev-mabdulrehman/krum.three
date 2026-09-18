'use server';

import { auth } from '@/config/firebase';
import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { loginSchema } from './schema';
import { ForgotPasswordFormState, FormState } from './types';

const SESSION_COOKIE_NAME =
	process.env.ADMIN_SESSION_COOKIE_NAME || 'krum_three_admin_session';


export async function loginAction(
	prevState: FormState | null,
	formData: FormData | z.infer<typeof loginSchema>,
): Promise<FormState> {
	// Extract raw values depending on whether FormData or a JS object was passed
	const rawEmail =
		formData instanceof FormData ? formData.get('email') : formData?.email;
	const rawPassword =
		formData instanceof FormData
			? formData.get('password')
			: formData?.password;

	const parsed = loginSchema.safeParse({
		email: rawEmail,
		password: rawPassword,
	});

	if (!parsed.success) {
		return { error: 'Invalid input data provided.' };
	}

	const { email, password } = parsed.data;

	try {
		// 1. Authenticate with Firebase Client SDK
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);

		// 2. Get ID token from user
		const idToken = await userCredential.user.getIdToken();

		// 3. Store token in HTTP-only cookie
		const cookieStore = await cookies();
		cookieStore.set(SESSION_COOKIE_NAME, idToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});
	} catch (err: any) {
		return { error: 'Invalid email or password credentials.' };
	}

	redirect('/admin/dashboard');
}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
	redirect('/admin/login');
}

const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
});


export async function forgotPasswordAction(
	prevState: ForgotPasswordFormState | null,
	formData: FormData | z.infer<typeof forgotPasswordSchema>,
): Promise<ForgotPasswordFormState> {
	const rawEmail =
		formData instanceof FormData ? formData.get('email') : formData?.email;

	const parsed = forgotPasswordSchema.safeParse({ email: rawEmail });

	if (!parsed.success) {
		return { error: 'Invalid email address provided.' };
	}

	try {
		await sendPasswordResetEmail(auth, parsed.data.email, {
			url: 'https://krumthree.pk/admin/reset-password',
		});
		return {
			success: true,
			message: 'Password reset link sent! Check your inbox.',
		};
	} catch (err: any) {
		return {
			error:
				err?.message ||
				'Failed to send password reset email. Please try again.',
		};
	}
}
