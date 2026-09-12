'use client';

import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import { Box, Store } from 'lucide-react';
import { useState } from 'react';

export default function BakeInventoryPage() {
	const [batches, setBatches] = useState([
		{
			id: 'b1',
			name: 'Almond Salted Butter Cookie',
			available: 14,
			total: 20,
		},
		{
			id: 'b2',
			name: 'Pistachio Cardamom Shortbread',
			available: 8,
			total: 15,
		},
		{
			id: 'b3',
			name: 'Dark Chocolate Hazelnut Crunch',
			available: 2,
			total: 12,
		},
	]);

	const updateBatch = (id: string, amount: number) => {
		setBatches(prev =>
			prev.map(b =>
				b.id === id
					? { ...b, available: Math.max(0, b.available + amount) }
					: b,
			),
		);
	};

	return (
		<div className='space-y-6 bg-white shadow-md p-8 border border-black/10 rounded'>
			<div className='flex justify-between items-center'>
				<FormHeader>Studio Bake Inventory</FormHeader>
				<span className='flex items-center gap-1.5 bg-amber-50 px-3 py-1 border border-amber-200 rounded-full font-semibold text-amber-800 text-xs'>
					<Store size={14} /> Morning Batch Control
				</span>
			</div>

			<div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
				{batches.map(batch => (
					<div
						key={batch.id}
						className='space-y-4 p-5 border border-black/10 rounded'
					>
						<div className='flex items-center gap-2'>
							<Box size={18} className='text-primary' />
							<h4 className='font-bold text-gray-900 text-sm'>
								{batch.name}
							</h4>
						</div>

						<div>
							<div className='flex justify-between mb-1 text-gray-500 text-xs'>
								<span>Remaining</span>
								<span className='font-bold text-gray-800'>
									{batch.available} / {batch.total} Boxes
								</span>
							</div>
							<div className='bg-gray-100 rounded-full w-full h-2'>
								<div
									className='bg-primary rounded-full h-2 transition-all'
									style={{
										width: `${(batch.available / batch.total) * 100}%`,
									}}
								/>
							</div>
						</div>

						<div className='flex gap-2 pt-2'>
							<Button
								onClick={() => updateBatch(batch.id, -1)}
								className='bg-gray-100 hover:bg-gray-200 w-1/2 text-gray-800 text-xs'
							>
								- 1 Box
							</Button>
							<Button
								onClick={() => updateBatch(batch.id, 1)}
								className='bg-primary w-1/2 text-white text-xs'
							>
								+ 1 Box
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
