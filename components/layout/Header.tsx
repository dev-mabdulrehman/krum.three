'use client';

import Logo from '@/assets/imgs/logo.png';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';
import { ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
	const dispatch = useAppDispatch();
	const cartItems = useAppSelector(state => state.cart.items);

	const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

	return (
		<header className='z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] w-full'>
			

			{/* Main Navbar */}
			<div className='bg-primary text-on-primary'>
				<div className='flex justify-between items-center gap-space-md mx-auto px-margin-mobile lg:px-gutter-desktop h-20 max-w-max-content-width'>
					<div className='flex items-center gap-space-md'>
						<Link className='flex flex-col' href='#'>
							<Image
								alt='Krum³ Artisanal Confectionery Logo'
								className='w-auto h-12 object-contain'
								src={Logo}
								width={120}
								height={32}
								priority
							/>
						</Link>
					</div>

					{/* Navigation Links */}
					<nav
						className='hidden xl:flex items-center gap-space-xs p-1'
						data-active-classes='bg-primary-container text-on-primary font-bold rounded-xl'
					>
						<Link
							aria-current='page'
							className='bg-primary-container px-space-sm py-space-xs rounded-xl font-bold text-on-primary transition-colors'
							href='#'
						>
							Home
						</Link>
						<Link
							className='text-primary-fixed hover:bg-primary-container px-space-sm py-space-xs rounded-xl font-label-md text-label-md hover:text-on-primary transition-colors'
							href='#signatures'
						>
							Menu
						</Link>
						<Link
							className='text-primary-fixed hover:bg-primary-container px-space-sm py-space-xs rounded-xl font-label-md text-label-md hover:text-on-primary transition-colors'
							href='#heritage'
						>
							Our Story
						</Link>
					</nav>

					{/* Action Buttons */}
					<div className='flex items-center gap-space-sm'>
						{/* Cart Trigger */}
						<button
							aria-label='Cart'
							onClick={() => dispatch(toggleCart(true))}
							className='relative flex justify-center items-center bg-primary-container hover:bg-tertiary-container rounded-xl w-10 h-10 text-on-primary transition-colors cursor-pointer'
							type='button'
						>
							<ShoppingBag className='w-5 h-5 text-on-primary' />
							{totalCount > 0 && (
								<span className='-top-1 -right-1 absolute flex justify-center items-center bg-secondary rounded-full w-5 h-5 font-label-sm font-bold text-label-sm text-on-secondary'>
									{totalCount}
								</span>
							)}
						</button>

						{/* User Icon */}
						<div className='flex justify-center items-center bg-primary rounded-full w-8 h-8'>
							<User className='w-4 h-4 text-on-primary' />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
