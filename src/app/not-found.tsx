'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<main className='relative flex flex-col justify-center items-center bg-surface-bright px-margin-mobile sm:px-gutter-desktop py-space-3xl min-h-screen overflow-hidden'>
			{/* Background Decorative Element */}
			<div className='top-1/2 left-1/2 -z-10 absolute bg-primary/5 blur-3xl rounded-full w-[30rem] h-[30rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none' />

			<div className='flex flex-col items-center max-w-lg text-center'>
				{/* 404 Large Badge / Text */}
				<span className='font-black text-primary/20 text-8xl sm:text-9xl tracking-tighter select-none'>
					404
				</span>

				{/* Header Section */}
				<div className='space-y-3 -mt-6 sm:-mt-8'>
					<div className='inline-flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full font-label-sm text-secondary uppercase tracking-widest'>
						<span className='bg-secondary rounded-full w-2 h-2 animate-ping' />
						Page Not Found
					</div>

					<h1 className='font-headline-lg font-bold text-headline-lg text-primary'>
						Lost in the digital space?
					</h1>

					<p className='max-w-md font-body-md text-body-md text-on-surface-variant'>
						The page you are looking for doesn't exist, has been
						moved, or is temporarily unavailable.
					</p>
				</div>

				{/* Action Buttons */}
				<div className='flex sm:flex-row flex-col justify-center items-center gap-3 mt-8 w-full sm:w-auto'>
					<button
						type='button'
						onClick={() => window.history.back()}
						className='inline-flex justify-center items-center gap-2 bg-surface-container-high hover:bg-surface-variant/40 px-5 py-3 border border-surface-variant/40 hover:border-surface-variant rounded-full w-full sm:w-auto font-label-md text-on-surface transition-all duration-200'
					>
						<ArrowLeft size={18} />
						<span>Go Back</span>
					</button>

					<Link
						href='/'
						className='inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm hover:shadow px-6 py-3 rounded-full w-full sm:w-auto font-label-md text-on-primary transition-all duration-200'
					>
						<Home size={18} />
						<span>Back to Home</span>
					</Link>
				</div>

				{/* Helpful Links / Quick Navigation */}
				<div className='mt-12 pt-8 border-surface-variant/30 border-t w-full'>
					<p className='mb-3 font-label-sm text-on-surface-variant text-xs uppercase tracking-wider'>
						Need help finding something?
					</p>
					<div className='flex justify-center items-center gap-6 font-label-md text-primary text-sm'>
						<Link href='/menu' className='hover:underline'>
							Our Menu
						</Link>
						<span className='text-surface-variant'>•</span>
						<Link href='/contact' className='hover:underline'>
							Contact Support
						</Link>
						<span className='text-surface-variant'>•</span>
						<Link href='/about' className='hover:underline'>
							About Us
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
