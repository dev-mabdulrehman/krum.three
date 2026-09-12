'use client';

import { forgotPasswordAction } from '@/actions/login/actions';
import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import Input from '@/components/admin/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
	const [serverState, action, isPending] = useActionState(
		forgotPasswordAction,
		null,
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = (data: ForgotPasswordFormData) => {
		startTransition(() => {
			action(data);
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='bg-white shadow-md p-8 w-4/5 md:w-1/2 lg:w-1/3'
		>
			<FormHeader>Forgot Password</FormHeader>

			<div className='space-y-4 mt-8'>
				{serverState?.error && (
					<div className='bg-red-50 p-3 border border-red-200 rounded font-medium text-red-600 text-sm'>
						{serverState.error}
					</div>
				)}

				{serverState?.success && (
					<div className='bg-green-50 p-3 border border-green-200 rounded font-medium text-green-700 text-sm'>
						{serverState.message}
					</div>
				)}

				<Input
					type='email'
					placeholder='Enter your email'
					icon={<Mail size={18} />}
					error={errors.email?.message}
					{...register('email')}
				/>

				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary w-full font-black text-white'
				>
					{isPending ? 'Sending Link...' : 'Reset Password'}
				</Button>
			</div>

			<div className='flex justify-center items-center mt-7'>
				<Link
					href='/admin/login'
					className='font-semibold text-blue-700 hover:underline'
				>
					Back to Login
				</Link>
			</div>
		</form>
	);
};

export default ForgotPassword;
