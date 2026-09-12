'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenuItems } from '@/store/slices/menuSlice';
import { useEffect } from 'react';
import MenuItemCard from './MenuItemCard';

export default function SignaturesMenu() {
	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector(state => state.menu);
	const cookieList = Object.values(items);

	useEffect(() => {
		dispatch(fetchMenuItems());
	}, [dispatch]);

	return (
		<section
			className='bg-surface-bright py-space-3xl lg:py-space-4xl w-full'
			id='signature-menu'
		>
			<div className='mx-auto px-margin-mobile lg:px-gutter-desktop max-w-max-content-width'>
				<div className='flex md:flex-row flex-col justify-between md:items-end gap-space-md mb-space-2xl'>
					<div className='flex flex-col gap-space-2xs max-w-xl'>
						<div className='flex items-center gap-space-xs'>
							<span className='bg-secondary w-8 h-px'></span>
							<span className='font-label-sm font-bold text-label-sm text-secondary uppercase tracking-widest'>
								Permanent Collection
							</span>
						</div>
						<h2 className='font-headline-lg text-headline-lg text-primary'>
							Menu
						</h2>
						<p className='font-body-md text-body-md text-on-surface-variant'>
							Each creation is baked thick with a soft,
							slow-cooked gooey core, rich nutty caramelization,
							and zero compromise on European chocolate and pure
							creamery dairy.
						</p>
					</div>
				</div>
				<div
					className='gap-space-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
					id='cookies-grid'
				>
					{cookieList.map((cookie: any) => (
						<MenuItemCard item={cookie} />
					))}
				</div>
			</div>
		</section>
	);
}
