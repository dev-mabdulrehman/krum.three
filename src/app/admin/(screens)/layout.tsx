'use client';

import LogoReverse from '@/assets/imgs/logo_reverse.png';
import { logoutAction } from '@/features/auth/actions';
import {
	Cookie,
	LayoutDashboard,
	LogOut,
	Menu,
	ShieldCheck,
	ShoppingBag,
	Store,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navItems = [
		{
			name: 'Dashboard',
			href: '/admin/dashboard',
			icon: <LayoutDashboard size={18} />,
		},
		{
			name: 'Orders',
			href: '/admin/orders',
			icon: <ShoppingBag size={18} />,
			badge: '8',
		},
		{
			name: 'Menu Items',
			href: '/admin/menu',
			icon: <Cookie size={18} />,
		},
		{
			name: 'Bake Inventory',
			href: '/admin/bake-inventory',
			icon: <Store size={18} />,
		},
	];

	return (
		<div className='flex flex-col bg-gray-100 min-h-screen font-sans antialiased'>
			{/* TOP HEADER */}
			<header className='top-0 z-30 sticky flex justify-between items-center bg-white shadow-sm px-6 py-4 border-black/10 border-b'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='md:hidden hover:bg-gray-100 p-2 rounded text-gray-600'
						aria-label='Toggle Navigation'
					>
						{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
					<div>
						<Image
							alt='Logo'
							loading='eager'
							className='w-26'
							src={LogoReverse}
						/>
					</div>
				</div>

				{/* Active Session Status & Logout */}
				<div className='flex items-center gap-4'>
					<form action={logoutAction}>
						<button
							type='submit'
							title='Logout'
							className='p-2 border border-black/10 hover:border-red-200 rounded text-gray-600 hover:text-red-600 transition-colors'
						>
							<LogOut size={18} />
						</button>
					</form>
				</div>
			</header>

			<div className='flex flex-1'>
				<aside className='hidden md:flex flex-col justify-between bg-white p-6 border-black/10 border-r w-64 shrink-0'>
					<nav className='space-y-2'>
						<p className='mb-3 font-bold text-gray-400 text-xs uppercase tracking-wider'>
							Management
						</p>

						{navItems.map(item => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 px-4 py-2.5 rounded font-bold text-sm transition-colors ${
										isActive
											? 'bg-primary text-white shadow-sm'
											: 'text-gray-600 hover:bg-gray-50'
									}`}
								>
									{item.icon}
									<span>{item.name}</span>
									{item.badge && (
										<span
											className={`ml-auto font-bold text-xs px-2 py-0.5 rounded-full ${
												isActive
													? 'bg-white/20 text-white'
													: 'bg-primary/10 text-primary'
											}`}
										>
											{item.badge}
										</span>
									)}
								</Link>
							);
						})}
					</nav>

					<div className='flex items-center gap-2 pt-4 border-black/10 border-t text-gray-400 text-xs'>
						<ShieldCheck size={16} className='text-green-600' />
						<span>Firebase Admin SDK v11</span>
					</div>
				</aside>

				{mobileMenuOpen && (
					<div className='md:hidden z-20 fixed inset-0 flex'>
						<div
							className='fixed inset-0 bg-black/30'
							onClick={() => setMobileMenuOpen(false)}
						/>
						<div className='z-30 relative flex flex-col justify-between bg-white p-6 w-64'>
							<nav className='space-y-2 mt-12'>
								<p className='mb-3 font-bold text-gray-400 text-xs uppercase tracking-wider'>
									Management
								</p>
								{navItems.map(item => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() =>
												setMobileMenuOpen(false)
											}
											className={`flex items-center gap-3 px-4 py-2.5 rounded font-bold text-sm transition-colors ${
												isActive
													? 'bg-primary text-white'
													: 'text-gray-600 hover:bg-gray-50'
											}`}
										>
											{item.icon}
											<span>{item.name}</span>
										</Link>
									);
								})}
							</nav>

							<div className='flex items-center gap-2 pt-4 border-black/10 border-t text-gray-400 text-xs'>
								<ShieldCheck
									size={16}
									className='text-green-600'
								/>
								<span>Firebase Admin SDK v11</span>
							</div>
						</div>
					</div>
				)}

				<main className='flex-1 p-4 md:p-8 overflow-y-auto'>
					{children}
				</main>
			</div>
		</div>
	);
}
