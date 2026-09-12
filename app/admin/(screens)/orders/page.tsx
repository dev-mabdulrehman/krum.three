'use client';

import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import Input from '@/components/admin/Input';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

const initialOrders = [
	{
		id: '#1024',
		customer: 'Sarah Jenkins',
		item: 'Almond Salted Butter Cookie',
		qty: '2 Boxes',
		status: 'In Kitchen',
	},
	{
		id: '#1023',
		customer: 'David Mehta',
		item: 'Pistachio Cardamom Shortbread',
		qty: '1 Box',
		status: 'Packing',
	},
	{
		id: '#1022',
		customer: 'Elena Rostova',
		item: 'Dark Chocolate Hazelnut Crunch',
		qty: '3 Boxes',
		status: 'Dispatched',
	},
];

export default function OrdersPage() {
	const [orders, setOrders] = useState(initialOrders);

	const toggleStatus = (id: string) => {
		setOrders(prev =>
			prev.map(o =>
				o.id === id
					? {
							...o,
							status:
								o.status === 'In Kitchen'
									? 'Packing'
									: 'Dispatched',
						}
					: o,
			),
		);
	};

	return (
		<div className='space-y-6 bg-white shadow-md p-8 border border-black/10 rounded'>
			<div className='flex md:flex-row flex-col justify-between md:items-center gap-4'>
				<FormHeader>Order Dispatch Queue</FormHeader>
				<div className='flex gap-3'>
					<div className='w-64'>
						<Input
							placeholder='Search orders...'
							icon={<Search size={18} />}
						/>
					</div>
					<Button className='flex items-center gap-2 bg-white border border-black/10 text-gray-700'>
						<Filter size={16} /> Filter
					</Button>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full text-sm text-left border-collapse'>
					<thead>
						<tr className='border-black/10 border-b font-bold text-gray-400 text-xs uppercase'>
							<th className='pb-3'>Order ID</th>
							<th className='pb-3'>Customer</th>
							<th className='pb-3'>Confection Item</th>
							<th className='pb-3'>Quantity</th>
							<th className='pb-3'>Status</th>
							<th className='pb-3 text-right'>Update Action</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-100'>
						{orders.map(o => (
							<tr key={o.id}>
								<td className='py-4 font-bold text-gray-900'>
									{o.id}
								</td>
								<td className='py-4 font-medium text-gray-700'>
									{o.customer}
								</td>
								<td className='py-4 text-gray-800'>{o.item}</td>
								<td className='py-4 text-gray-500'>{o.qty}</td>
								<td className='py-4'>
									<span
										className={`text-xs font-semibold px-2.5 py-1 rounded border ${
											o.status === 'In Kitchen'
												? 'bg-amber-50 text-amber-700 border-amber-200'
												: o.status === 'Packing'
													? 'bg-blue-50 text-blue-700 border-blue-200'
													: 'bg-green-50 text-green-700 border-green-200'
										}`}
									>
										{o.status}
									</span>
								</td>
								<td className='py-4 text-right'>
									{o.status !== 'Dispatched' ? (
										<Button
											onClick={() => toggleStatus(o.id)}
											className='bg-primary px-3 py-1.5 text-white text-xs'
										>
											Advance Status
										</Button>
									) : (
										<span className='font-semibold text-gray-400 text-xs'>
											Completed
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
