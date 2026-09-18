'use client';
import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { loginAction } from '../actions';
import { loginSchema } from '../schema';
import { LoginFormData } from '../types';
import PasswordField from './PasswordField';

const LoginForm = () => {
	const [serverState, action, isPending] = useActionState(loginAction, null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormData) => {
		// Convert JS object to FormData so useActionState receives standard payload
		const formData = new FormData();
		formData.append('email', data.email);
		formData.append('password', data.password);

		startTransition(() => {
			action(formData);
		});
	};;

	return (
		<>
			{serverState?.error && (
				<div className='flex items-center gap-3 bg-red-50 p-3.5 border border-red-200/80 rounded-lg text-red-700 text-sm animate-in duration-200 fade-in'>
					<AlertCircle className='w-5 h-5 text-red-500 shrink-0' />
					<p className='font-medium'>{serverState.error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
				<div className='space-y-4'>
					<div>
						<Input
							type='email'
							placeholder='admin@bakery.com'
							icon={<Mail size={18} className='text-slate-400' />}
							error={errors.email?.message}
							{...register('email')}
						/>
					</div>
					<PasswordField register={register} errors={errors} />
				</div>

				<div className='flex justify-end items-center'>
					<Link
						href='/admin/forgot-password'
						className='font-semibold text-primary hover:text-primary/80 text-xs hover:underline transition-all'
					>
						Forgot password?
					</Link>
				</div>

				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary hover:bg-primary/90 disabled:opacity-70 shadow-md shadow-primary/20 rounded-xl w-full h-11 font-semibold text-white transition-all'
				>
					{isPending ? (
						<span className='flex justify-center items-center gap-2'>
							<span className='border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin' />
							Signing in...
						</span>
					) : (
						'Sign In to Dashboard'
					)}
				</Button>
			</form>
		</>
	);
};

export default LoginForm;
