'use client';

import Button from '@/components/admin/Button';
import { Modal } from '@/components/ui/Modal';
import { MenuItem } from '@/store/slices/menuSlice';
import { Cookie, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MenuItemCardProps {
	item: MenuItem;
	onEdit: (item: MenuItem) => void;
	onDelete: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const handleConfirmDelete = () => {
		onDelete(item);
		setShowConfirm(false);
	};

	return (
		<>
			<div className='flex justify-between items-start gap-4 py-4'>
				<div className='flex items-start gap-4'>
					<div className='flex justify-center items-center bg-primary/10 mt-1 rounded w-12 h-12 overflow-hidden text-primary shrink-0'>
						{item.imgSrc ? (
							<img
								src={item.imgSrc}
								alt={item.imgAlt || item.name}
								className='w-full h-full object-cover'
							/>
						) : (
							<Cookie size={24} />
						)}
					</div>

					<div className='space-y-1'>
						<div className='flex flex-wrap items-center gap-2'>
							<h4 className='font-bold text-gray-900'>
								{item.name}
							</h4>
							{item.badge && (
								<span className='bg-amber-50 px-2 py-0.5 border border-amber-200 rounded font-bold text-amber-700 text-xs'>
									{item.badge}
								</span>
							)}
							<span className='bg-green-50 px-2 py-0.5 border border-green-200 rounded font-semibold text-green-700 text-xs'>
								{item.stockStatus}
							</span>
						</div>

						<p className='text-gray-600 text-sm line-clamp-2'>
							{item.description}
						</p>

						<div className='flex items-center gap-4 pt-1 font-semibold text-gray-500 text-xs'>
							<span>{item.price} PKR</span>
							<span>•</span>
							<span>{item.weight}</span>
						</div>
					</div>
				</div>

				<div className='flex items-center gap-1 shrink-0'>
					<button
						onClick={() => onEdit(item)}
						className='p-2 text-gray-400 hover:text-primary transition-colors'
						title='Edit Item'
					>
						<Edit2 size={18} />
					</button>
					<button
						onClick={() => setShowConfirm(true)}
						className='p-2 text-gray-400 hover:text-red-600 transition-colors'
						title='Delete Item'
					>
						<Trash2 size={18} />
					</button>
				</div>
			</div>

			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				title='Delete Menu Item'
				description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
				maxWidth='sm'
				footer={
					<>
						<Button
							type='button'
							onClick={() => setShowConfirm(false)}
							className='bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded font-semibold text-gray-700'
						>
							Cancel
						</Button>
						<Button
							type='button'
							onClick={handleConfirmDelete}
							className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white'
						>
							Delete
						</Button>
					</>
				}
			>
				<p className='text-gray-600 text-sm'>
					Deleting this menu item will permanently remove it from your
					store directory.
				</p>
			</Modal>
		</>
	);
}

export function MenuItemCardSkeleton() {
	return (
		<div className='flex justify-between items-start gap-4 py-4 animate-pulse'>
			<div className='flex items-start gap-4 w-full'>
				<div className='bg-gray-200 mt-1 rounded w-12 h-12 shrink-0' />
				<div className='space-y-2 w-full max-w-md'>
					<div className='flex items-center gap-2'>
						<div className='bg-gray-200 rounded w-32 h-5' />
						<div className='bg-gray-200 rounded w-16 h-4' />
						<div className='bg-gray-200 rounded w-20 h-4' />
					</div>

					<div className='space-y-1'>
						<div className='bg-gray-200 rounded w-full h-4' />
						<div className='bg-gray-200 rounded w-3/4 h-4' />
					</div>

					<div className='flex items-center gap-2 pt-1'>
						<div className='bg-gray-200 rounded w-16 h-3' />
						<div className='bg-gray-200 rounded w-12 h-3' />
					</div>
				</div>
			</div>

			<div className='flex items-center gap-1 shrink-0'>
				<div className='bg-gray-200 p-2 rounded w-8 h-8' />
				<div className='bg-gray-200 p-2 rounded w-8 h-8' />
			</div>
		</div>
	);
}
