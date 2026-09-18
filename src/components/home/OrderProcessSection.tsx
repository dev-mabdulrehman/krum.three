import { Flame, HeartHandshake, ShoppingBag, Truck } from 'lucide-react';
import React from 'react';

interface ProcessStep {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

const steps: ProcessStep[] = [
	{
		title: 'Easy Ordering',
		description:
			'Select your treats and complete secure checkout in seconds.',
		icon: ShoppingBag,
	},
	{
		title: 'Freshly Baked',
		description:
			'Our bakers craft your order fresh right after you place it.',
		icon: Flame,
	},
	{
		title: 'Express Shipping',
		description:
			'Packed safely in thermal-sealed boxes for fast nationwide transit.',
		icon: Truck,
	},
	{
		title: 'Warm & Ready',
		description: 'Unbox perfection at your doorstep—warm up and enjoy!',
		icon: HeartHandshake,
	},
];

export function OrderProcessSection() {
	return (
		<section className='bg-olive-200'>
			<section className='mx-auto px-4 py-12 max-w-7xl'>
				<div className='gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={index}
								className='flex flex-col items-center p-4 rounded-2xl text-center transition-transform'
							>
								{/* SVG Icon Container */}
								<div className='flex justify-center items-center bg-amber-800/10 mb-4 rounded-full w-20 h-20 text-amber-900'>
									<Icon className='stroke-[1.75] w-10 h-10' />
								</div>

								{/* Text Section */}
								<div className='space-y-2'>
									<h3 className='font-semibold text-gray-900 text-lg'>
										{step.title}
									</h3>
									<p className='max-w-[240px] text-gray-600 text-sm'>
										{step.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</section>
	);
}
