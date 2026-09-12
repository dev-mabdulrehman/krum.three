'use server';

import { auth } from '@/config/firebase';
import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type FormState = {
	success?: boolean;
	error?: string;
};

export async function loginAction(
	prevState: FormState | null,
	data: z.infer<typeof loginSchema>,
): Promise<FormState> {
	const parsed = loginSchema.safeParse(data);

	if (!parsed.success) {
		return { error: 'Invalid input data provided.' };
	}

	const { email, password } = parsed.data;

	try {
		// 1. Authenticate with Client SDK
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
	} catch (err) {
		return { error: 'Invalid email or password credentials.' };
	}

	// 5. Redirect to protected dashboard
	redirect('/admin/dashboard');
}
export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete('session');
	redirect('/login');
}

const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
});

export type ForgotPasswordFormState = {
	success?: boolean;
	message?: string;
	error?: string;
};
export async function forgotPasswordAction(
	prevState: ForgotPasswordFormState | null,
	data: z.infer<typeof forgotPasswordSchema>,
): Promise<ForgotPasswordFormState> {
	const parsed = forgotPasswordSchema.safeParse(data);

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
