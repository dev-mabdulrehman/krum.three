'use client';

import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import Input from '@/components/admin/Input';
import { AddOrderForm } from '@/components/admin/order/AddOrderForm';
import { Modal } from '@/components/ui/Modal';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface Order {
	id: string;
	customer: string;
	item: string;
	qty: string;
	status: string;
	source?: string;
}

const initialOrders: Order[] = [
	{
		id: '#1024',
		customer: 'Sarah Jenkins',
		item: 'Almond Salted Butter Cookie',
		qty: '2 Boxes',
		status: 'In Kitchen',
		source: 'Website',
	},
	{
		id: '#1023',
		customer: 'David Mehta',
		item: 'Pistachio Cardamom Shortbread',
		qty: '1 Box',
		status: 'Packing',
		source: 'Phone',
	},
	{
		id: '#1022',
		customer: 'Elena Rostova',
		item: 'Dark Chocolate Hazelnut Crunch',
		qty: '3 Boxes',
		status: 'Dispatched',
		source: 'Instacart',
	},
];

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>(initialOrders);
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	// New Order Form State
	const [formData, setFormData] = useState({
		customer: '',
		item: '',
		qtyCount: '1',
		unit: 'Box',
		source: 'Phone/Manual',
	});

	// Advance order pipeline status
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

	// Handle Admin Manual Order Submission
	const handleCreateOrder = async (data: unknown) => {
		console.log('New Order Submitted:', data);
	};

	const filteredOrders = orders.filter(
		o =>
			o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			o.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
			o.id.includes(searchTerm),
	);

	return (
		<div className='space-y-6 bg-white shadow-md p-8 border border-black/10 rounded'>
			{/* Header & Controls */}
			<div className='flex md:flex-row flex-col justify-between md:items-center gap-4'>
				<FormHeader>Order Dispatch Queue</FormHeader>
				<div className='flex sm:flex-row flex-col gap-3'>
					<div className='w-full sm:w-64'>
						<Input
							placeholder='Search orders...'
							icon={<Search size={18} />}
							value={searchTerm}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>,
							) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Button className='flex items-center gap-2 bg-white border border-black/10 text-gray-700'>
						<Filter size={16} /> Filter
					</Button>
					<Button
						onClick={() => setIsModalOpen(true)}
						className='flex justify-center items-center gap-2 bg-primary px-4 py-2 font-medium text-white text-sm'
					>
						<Plus size={18} /> Take Admin Order
					</Button>
				</div>
			</div>

			{/* Orders Table */}
			<div className='overflow-x-auto'>
				<table className='w-full text-sm text-left border-collapse'>
					<thead>
						<tr className='border-black/10 border-b font-bold text-gray-400 text-xs uppercase'>
							<th className='pb-3'>Order ID</th>
							<th className='pb-3'>Source</th>
							<th className='pb-3'>Customer</th>
							<th className='pb-3'>Confection Item</th>
							<th className='pb-3'>Quantity</th>
							<th className='pb-3'>Status</th>
							<th className='pb-3 text-right'>Update Action</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-100'>
						{filteredOrders.map(o => (
							<tr key={o.id}>
								<td className='py-4 font-bold text-gray-900'>
									{o.id}
								</td>
								<td className='py-4'>
									<span className='bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs'>
										{o.source || 'Website'}
									</span>
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

			{/* Take Order Modal */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Take Admin Order'
				maxWidth='md'
				footer={
					<>
						<Button
							type='button'
							onClick={() => setIsModalOpen(false)}
							className='bg-gray-100 text-gray-700 text-xs'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							form='add-order-form'
							className='bg-primary text-white text-xs'
						>
							Create Order
						</Button>
					</>
				}
			>
				<AddOrderForm onSubmit={handleCreateOrder} />
			</Modal>
		</div>
	);
}
