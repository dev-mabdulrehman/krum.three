'use client';

import { MenuItem } from '@/store/slices/menuSlice';
import { Cookie, Edit2, Trash2 } from 'lucide-react';

interface MenuItemCardProps {
	item: MenuItem;
	onEdit: (item: MenuItem) => void;
	onDelete: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
	return (
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
						<h4 className='font-bold text-gray-900'>{item.name}</h4>
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
					onClick={() => onDelete(item)}
					className='p-2 text-gray-400 hover:text-red-600 transition-colors'
					title='Delete Item'
				>
					<Trash2 size={18} />
				</button>
			</div>
		</div>
	);
}
