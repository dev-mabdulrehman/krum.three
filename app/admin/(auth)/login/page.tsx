'use client';

import { loginAction } from '@/actions/login/actions';
import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import Input from '@/components/admin/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Lock, Mail } from 'lucide-react';
import { startTransition, useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Move schema & types outside component scope
const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
	const [serverState, action, isPending] = useActionState(loginAction, null);
	const [passwordVisible, setPasswordVisible] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormData) => {
		startTransition(() => {
			action(data);
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='bg-white shadow-md p-8 w-4/5 md:w-1/2 lg:w-1/3'
		>
			<FormHeader>Login</FormHeader>

			<div className='space-y-4 mt-8'>
				{serverState?.error && (
					<div className='bg-red-50 p-3 border border-red-200 rounded font-medium text-red-600 text-sm'>
						{serverState.error}
					</div>
				)}

				<Input
					type='email'
					placeholder='Email'
					icon={<Mail size={18} />}
					error={errors.email?.message}
					{...register('email')}
				/>

				<Input
					type={passwordVisible ? 'text' : 'password'}
					placeholder='Password'
					icon={<Lock size={18} />}
					rightIcon={
						<Eye
							onClick={() => {
								setPasswordVisible(prevState => !prevState);
							}}
							className='cursor-pointer'
							size={18}
						/>
					}
					error={errors.password?.message}
					{...register('password')}
				/>

				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary w-full font-black text-white'
				>
					{isPending ? 'Logging in...' : 'Login'}
				</Button>
			</div>
			{/* <div className='flex justify-center items-center mt-7'>
				<Link
					href='/admin/forgot-password'
					className='font-semibold text-blue-700 hover:underline'
				>
					Forgot Password?
				</Link>
			</div> */}
		</form>
	);
};

export default Login;
