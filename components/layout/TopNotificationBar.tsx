'use client';

import { useAppSelector } from '@/store/hooks';

export default function TopNotificationBar() {
	const bannerText = useAppSelector(state => state.menu.bannerText);

	return (
		<div className='bg-tertiary px-margin-mobile md:px-gutter-desktop py-1 text-on-tertiary text-center'>
			<p className='text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider'>
				{bannerText ||
					'Freshly Baked in Gujrat • Same-Day Local Delivery • Limited Daily Batches'}
			</p>
		</div>
	);
}
