import {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form';
import z from 'zod';
import { loginSchema } from './schema';

export type FormState = {
	success?: boolean;
	error?: string;
};

export type ForgotPasswordFormState = {
	success?: boolean;
	message?: string;
	error?: string;
};
export interface AuthUser {
	id: string;
	email: string;
	name?: string;
	role?: 'admin' | 'user';
}

export interface AuthState {
	isAuthenticated: boolean;
	user: AuthUser | null;
	token: string | null;
	isLoading: boolean;
}

export interface SetCredentialsPayload {
	user: AuthUser;
	token: string;
}

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isPending: boolean;
	errors: FieldErrors<LoginFormData>;
	register: UseFormRegister<LoginFormData>;
	handleSubmit: UseFormHandleSubmit<LoginFormData>;
	serverError?: string | null;
}

// Re-use LoginFormData here for consistency
export interface PasswordFieldProps {
	register: UseFormRegister<LoginFormData>;
	errors: FieldErrors<LoginFormData>;
}
