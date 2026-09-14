'use client';

import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import { Cookie, Store } from 'lucide-react';
import { useState } from 'react';

export default function BakeInventoryPage() {
	const [menuItems, setMenuItems] = useState([
		{
			id: 'm1',
			name: 'Almond Salted Butter Cookie',
			quantity: 42,
			minThreshold: 10,
		},
		{
			id: 'm2',
			name: 'Pistachio Cardamom Shortbread',
			quantity: 18,
			minThreshold: 15,
		},
		{
			id: 'm3',
			name: 'Dark Chocolate Hazelnut Crunch',
			quantity: 5,
			minThreshold: 12,
		},
	]);

	const updateQuantity = (id: string, delta: number) => {
		setMenuItems(prev =>
			prev.map(item =>
				item.id === id
					? { ...item, quantity: Math.max(0, item.quantity + delta) }
					: item,
			),
		);
	};

	return (
		<div className='space-y-6 bg-white shadow-md p-8 border border-black/10 rounded'>
			<div className='flex justify-between items-center'>
				<FormHeader>Menu Item Inventory</FormHeader>
				<span className='flex items-center gap-1.5 bg-amber-50 px-3 py-1 border border-amber-200 rounded-full font-semibold text-amber-800 text-xs'>
					<Store size={14} /> Live Stock Control
				</span>
			</div>

			<div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
				{menuItems.map(item => {
					const isLowStock = item.quantity <= item.minThreshold;

					return (
						<div
							key={item.id}
							className={`space-y-4 p-5 border rounded transition-colors ${
								isLowStock
									? 'border-red-200 bg-red-50/30'
									: 'border-black/10 bg-white'
							}`}
						>
							<div className='flex items-center gap-2'>
								<Cookie size={18} className='text-primary' />
								<h4 className='font-bold text-gray-900 text-sm'>
									{item.name}
								</h4>
							</div>

							<div className='flex justify-between items-baseline py-2 border-gray-100 border-y'>
								<span className='text-gray-500 text-xs'>
									In Stock
								</span>
								<div className='flex items-baseline gap-1'>
									<span
										className={`font-bold text-2xl ${
											isLowStock
												? 'text-red-600'
												: 'text-gray-900'
										}`}
									>
										{item.quantity}
									</span>
									<span className='text-gray-500 text-xs'>
										units
									</span>
								</div>
							</div>

							{/* Stock Quick Adjustment Controls */}
							<div className='flex gap-2 pt-1'>
								<Button
									onClick={() => updateQuantity(item.id, -1)}
									className='bg-gray-100 hover:bg-gray-200 border-none w-1/2 text-gray-800 text-xs'
								>
									- 1
								</Button>
								<Button
									onClick={() => updateQuantity(item.id, 1)}
									className='bg-primary hover:bg-primary/90 w-1/2 text-white text-xs'
								>
									+ 1
								</Button>
							</div>

							{/* Batch Adjustment Controls */}
							<div className='flex gap-2'>
								<Button
									onClick={() => updateQuantity(item.id, -5)}
									className='bg-gray-50 hover:bg-gray-100 border-gray-200 w-1/2 text-gray-600 text-xs'
								>
									- 5
								</Button>
								<Button
									onClick={() => updateQuantity(item.id, 5)}
									className='bg-gray-50 hover:bg-gray-100 border-gray-200 w-1/2 text-gray-600 text-xs'
								>
									+ 5
								</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
