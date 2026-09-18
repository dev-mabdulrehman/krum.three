'use client';
import Input from '@/components/admin/Input';
import { Eye, EyeOff, Lock } from 'lucide-react';
import React from 'react';
import { PasswordFieldProps } from '../types';

const PasswordField = ({ register, errors }: PasswordFieldProps) => {
	let [passwordVisible, setPasswordVisible] = React.useState(false);
	return (
		<Input
			type={passwordVisible ? 'text' : 'password'}
			placeholder='••••••••'
			icon={<Lock size={18} className='text-slate-400' />}
			rightIcon={
				<button
					type='button'
					onClick={() => setPasswordVisible(prev => !prev)}
					className='focus:outline-none text-slate-400 hover:text-slate-600 transition-colors'
					aria-label={
						passwordVisible ? 'Hide password' : 'Show password'
					}
				>
					{passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			}
			error={errors.password?.message}
			{...register('password')}
		/>
	);
};

export default PasswordField;
