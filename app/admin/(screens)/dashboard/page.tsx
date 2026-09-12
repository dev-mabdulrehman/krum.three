'use client';

import FormHeader from '@/components/admin/FormHeader';
import Input from '@/components/admin/Input';
import {
    Box,
    Clock,
    Cookie,
    DollarSign,
    Search,
    ShoppingBag,
    Store,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
	return (
		<div className='space-y-8'>
			<FormHeader>Studio Dashboard</FormHeader>

			{/* Metrics Row */}
			<div className='gap-6 grid grid-cols-1 md:grid-cols-4'>
				<div className='flex justify-between items-center bg-white shadow-md p-6 border border-black/10 rounded'>
					<div>
						<p className='font-bold text-gray-400 text-xs uppercase'>
							Today's Revenue
						</p>
						<h2 className='mt-1 font-black text-gray-900 text-2xl'>
							$1,840.00
						</h2>
					</div>
					<div className='flex justify-center items-center bg-primary/10 rounded w-10 h-10 text-primary'>
						<DollarSign size={20} />
					</div>
				</div>

				<div className='flex justify-between items-center bg-white shadow-md p-6 border border-black/10 rounded'>
					<div>
						<p className='font-bold text-gray-400 text-xs uppercase'>
							Active Orders
						</p>
						<h2 className='mt-1 font-black text-gray-900 text-2xl'>
							8 Pending
						</h2>
					</div>
					<div className='flex justify-center items-center bg-primary/10 rounded w-10 h-10 text-primary'>
						<Clock size={20} />
					</div>
				</div>

				<div className='flex justify-between items-center bg-white shadow-md p-6 border border-black/10 rounded'>
					<div>
						<p className='font-bold text-gray-400 text-xs uppercase'>
							Morning Bake Left
						</p>
						<h2 className='mt-1 font-black text-gray-900 text-2xl'>
							14 Boxes
						</h2>
					</div>
					<div className='flex justify-center items-center bg-primary/10 rounded w-10 h-10 text-primary'>
						<Box size={20} />
					</div>
				</div>

				<div className='flex justify-between items-center bg-white shadow-md p-6 border border-black/10 rounded'>
					<div>
						<p className='font-bold text-gray-400 text-xs uppercase'>
							Low Stock Alert
						</p>
						<h2 className='mt-1 font-black text-amber-600 text-2xl'>
							2 Items
						</h2>
					</div>
					<div className='flex justify-center items-center bg-amber-50 rounded w-10 h-10 text-amber-600'>
						<Cookie size={20} />
					</div>
				</div>
			</div>

			{/* Table & Quick Actions */}
			<div className='gap-8 grid grid-cols-1 lg:grid-cols-3'>
				<div className='space-y-4 lg:col-span-2 bg-white shadow-md p-6 border border-black/10 rounded'>
					<div className='flex justify-between items-center'>
						<h3 className='font-black text-gray-900 text-lg'>
							Recent Kitchen Orders
						</h3>
						<div className='w-64'>
							<Input
								placeholder='Search order ID...'
								icon={<Search size={18} />}
							/>
						</div>
					</div>

					<table className='w-full text-sm text-left'>
						<thead>
							<tr className='border-black/10 border-b font-bold text-gray-400 text-xs uppercase'>
								<th className='pb-3'>Order ID</th>
								<th className='pb-3'>Item</th>
								<th className='pb-3'>Qty</th>
								<th className='pb-3'>Status</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							<tr>
								<td className='py-4 font-bold text-gray-900'>
									#1024
								</td>
								<td className='py-4 font-medium text-gray-800'>
									Almond Salted Butter Cookie
								</td>
								<td className='py-4 text-gray-500'>2 Boxes</td>
								<td className='py-4'>
									<span className='bg-amber-50 px-2.5 py-1 border border-amber-200 rounded font-semibold text-amber-700 text-xs'>
										In Kitchen
									</span>
								</td>
							</tr>
							<tr>
								<td className='py-4 font-bold text-gray-900'>
									#1023
								</td>
								<td className='py-4 font-medium text-gray-800'>
									Pistachio Cardamom Shortbread
								</td>
								<td className='py-4 text-gray-500'>1 Box</td>
								<td className='py-4'>
									<span className='bg-blue-50 px-2.5 py-1 border border-blue-200 rounded font-semibold text-blue-700 text-xs'>
										Packing
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className='space-y-4 bg-white shadow-md p-6 border border-black/10 rounded'>
					<h3 className='pb-3 border-black/10 border-b font-black text-gray-900 text-lg'>
						Quick Navigation
					</h3>
					<div className='space-y-3'>
						<Link
							href='/admin/orders'
							className='flex items-center gap-3 hover:bg-gray-50 p-3 border border-black/10 rounded font-semibold text-sm'
						>
							<ShoppingBag size={18} className='text-primary' />{' '}
							View Order Queue
						</Link>
						<Link
							href='/admin/menu'
							className='flex items-center gap-3 hover:bg-gray-50 p-3 border border-black/10 rounded font-semibold text-sm'
						>
							<Cookie size={18} className='text-primary' /> Manage
							Confection Menu
						</Link>
						<Link
							href='/admin/bake-inventory'
							className='flex items-center gap-3 hover:bg-gray-50 p-3 border border-black/10 rounded font-semibold text-sm'
						>
							<Store size={18} className='text-primary' /> Update
							Morning Bake Batches
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
