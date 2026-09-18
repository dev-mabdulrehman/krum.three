import LoginForm from '@/features/auth/components/LoginForm';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
	return (
		<div className='flex justify-center items-center p-4 sm:p-6 lg:p-8 min-h-screen'>
			<div className='space-y-6 bg-white shadow-slate-200/50 shadow-xl p-8 border border-slate-100 rounded-2xl w-full max-w-md transition-all'>
				<div className='flex flex-col items-center space-y-2 text-center'>
					<div className='flex justify-center items-center bg-primary/10 mb-1 rounded-xl w-12 h-12 text-primary'>
						<ShieldCheck size={28} />
					</div>
					<h1 className='font-bold text-slate-900 text-2xl tracking-tight'>
						Welcome Back
					</h1>
					<p className='text-slate-500 text-sm'>
						Please enter your admin credentials to access the portal
					</p>
				</div>

				<LoginForm />
				<div className='pt-2 text-center'>
					<p className='text-slate-400 text-xs'>
						Protected by admin access control.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
