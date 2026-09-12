'use client';

import { BadgeCheck, Box, Cookie, Flame, Medal, Scale } from "lucide-react";


export default function HeroSection() {
	return (
		<section className='relative bg-gradient py-space-3xl lg:py-space-4xl w-full overflow-hidden text-on-primary'>
			{/* Ambient organic gradient glow */}
			{/* <Header />
			<TopLiveNotificationBar /> */}
			<div className='-top-24 -left-24 absolute bg-primary-container/40 blur-3xl rounded-full w-96 h-96 pointer-events-none'></div>
			<div className='right-0 -bottom-24 absolute bg-secondary/15 blur-3xl rounded-full w-[30rem] h-[30rem] pointer-events-none'></div>
			<div className='z-10 relative mx-auto px-margin-mobile lg:px-gutter-desktop max-w-max-content-width'>
				<div className='items-center gap-space-xl lg:gap-space-2xl grid grid-cols-1 lg:grid-cols-12'>
					{/* Left Hero Copy */}
					<div className='flex flex-col items-start gap-space-md lg:col-span-6'>
						<div className='inline-flex text-secondary-fixed items-center gap-space-xs bg-secondary/20 px-space-sm py-1 rounded-full font-label-sm text-label-sm tracking-wide'>
							<Medal
								className='secondary-fixed text-sm'
								size={'0.8rem'}
							/>
							<span>
								Handcrafted in Small Batches • Gujrat, Pakistan
							</span>
						</div>
						<h1 className='font-display-lg font-headline-lg text-display-lg text-surface-bright lg:text-display-lg leading-tight tracking-tight'>
							Baked with{' '}
							<span className='text-secondary-fixed font-normal italic'>
								Obsession
							</span>
							.<br />
							Shared by Three Brothers.
						</h1>
						<p className='text-primary-fixed max-w-xl font-body-lg text-body-lg leading-relaxed'>
							Thick, molten-centered artisanal cookies crafted
							with imported Belgian chocolate, French cultured
							butter, and slow-roasted nuts. Freshly pulled from
							our stone ovens every morning in Gujrat.
						</p>
						<div className='flex flex-wrap items-center gap-space-sm pt-space-xs'>
							<a
								className='inline-flex justify-center items-center gap-space-xs bg-secondary hover:bg-secondary-container shadow-md px-space-lg py-space-sm rounded-xl font-label-md text-label-md text-on-secondary hover:text-on-secondary-container active:scale-95 transition-all'
								href='#signature-menu'
							>
								<Cookie className='hover:bg-secondary-container w-5 h-5' />
								<span>Order Fresh Batch</span>
							</a>
							<button className='inline-flex justify-center items-center gap-space-xs bg-primary-container hover:bg-tertiary-container shadow-sm px-space-lg py-space-sm rounded-xl font-label-md text-label-md text-on-primary active:scale-95 transition-all'>
								<Box className='w-5 h-5 text-on-primary' />
								<span>Build a Box of 4</span>
								<span className='bg-secondary px-1.5 py-0.5 rounded-full font-label-sm text-label-sm text-on-secondary uppercase'>
									Free Tote
								</span>
							</button>
						</div>
						{/* Proof points bar */}
						<div className='gap-space-md grid grid-cols-3 pt-space-md w-full max-w-lg'>
							<div className='flex flex-col'>
								<span className='font-headline-sm text-headline-sm text-surface-bright'>
									180g
								</span>
								<span className='text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider'>
									Giant Molten Center
								</span>
							</div>
							<div className='flex flex-col'>
								<span className='font-headline-sm text-headline-sm text-surface-bright'>
									48 Hr
								</span>
								<span className='text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider'>
									Dough Cold Rest
								</span>
							</div>
							<div className='flex flex-col'>
								<span className='font-headline-sm text-headline-sm text-surface-bright'>
									100%
								</span>
								<span className='text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider'>
									Pure French Butter
								</span>
							</div>
						</div>
					</div>
					{/* Right Hero Visual */}
					<div className='relative flex justify-center items-center lg:col-span-6'>
						<div className='relative w-full max-w-md lg:max-w-lg aspect-square'>
							{/* Subtle spinning parchment glow */}
							<div className='absolute inset-4 bg-secondary/15 blur-2xl rounded-full animate-pulse' />
							{/* Plate Framing with real placeholder */}
							<div className='z-10 relative flex justify-center items-center bg-surface-container/20 shadow-2xl backdrop-blur-md p-4 rounded-full w-full h-full'>
								<div className='group relative shadow-inner rounded-full w-full h-full overflow-hidden'>
									<img
										alt='Signature Molten Chocolate Sea Salt Cookie'
										className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
										id='hero-img'
										src='https://lh3.googleusercontent.com/aida-public/AB6AXuC1qXwJpZXHKJ3opjNKfBz_TyGo9tRvLwDG2gOhKvGzniozgv_A-KBxKSOxuOvihcv0qviS5kMJ83AwsgUmzx3oeZPkf36aaXvPfi9WrVNDJQJ8iRDW8WsWPBb3T8b5x8AU5t97SS9EFh5dWd1acWD-0vz__202MIzWobQTsXfN1e87AUpuxgpTEUfFX4WW_UbvvhvRRV2XxJCSOJHw0PnyJAv59wk_CxZmU6xCCNzGU2O97Y-qbiLLKA'
									/>
									<div className='absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent' />
									<div className='right-6 bottom-6 left-6 absolute text-center'>
										<span className='text-secondary-fixed bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-widest'>
											Gujrat Signature Edition
										</span>
										<p className='mt-1 font-headline-sm text-headline-sm text-surface-bright'>
											The Sea Salt Molten Chocolate Chunk
										</p>
									</div>
								</div>
							</div>
							{/* Floating Badge 1: 180g Giant */}
							<div className='-top-2 -left-2 z-20 absolute flex items-center gap-space-xs bg-surface-container-lowest shadow-lg p-3 rounded-2xl text-on-surface -rotate-3 hover:rotate-0 transition-transform transform'>
								<div className='flex justify-center items-center bg-primary-container rounded-xl w-10 h-10 text-on-primary'>
									<Scale />
								</div>
								<div className='flex flex-col'>
									<span className='font-label-sm text-label-sm text-secondary uppercase tracking-wider'>
										Weight Class
									</span>
									<span className='font-title-md font-bold text-primary text-title-md'>
										180g Giant
									</span>
								</div>
							</div>
							{/* Floating Badge 2: Batch Counter */}
							<div className='-right-2 bottom-4 z-20 absolute flex items-center gap-space-xs bg-surface-container-lowest shadow-xl p-3 rounded-2xl text-on-surface rotate-2 hover:rotate-0 transition-transform transform'>
								<div className='flex justify-center items-center bg-secondary rounded-xl w-10 h-10 text-on-secondary'>
									<Flame />
								</div>
								<div className='flex flex-col'>
									<span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>
										Status
									</span>
									<span className='font-title-md font-bold text-primary text-title-md'>
										Hot Oven Ready
									</span>
								</div>
							</div>
							{/* Floating Badge 3: Single Origin */}
							<div className='-bottom-4 left-1/4 z-20 absolute flex items-center gap-space-2xs bg-tertiary shadow-lg px-4 py-1.5 rounded-full font-label-sm text-label-sm text-on-tertiary'>
								<span className='text-tertiary-fixed text-[16px] material-symbols-outlined'>
									<BadgeCheck size={'16px'}/>
								</span>
								<span>French Butter • Valrhona 70%</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
