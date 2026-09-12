'use client';

import Button from '@/components/admin/Button';
import FormHeader from '@/components/admin/FormHeader';
import { MenuItem } from '@/store/slices/menuSlice';
import { Plus } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';

interface MenuItemListProps {
	items: MenuItem[];
	onEditItem: (item: MenuItem) => void;
	onDeleteItem: (item: MenuItem) => void;
	onOpenModal: () => void;
}

export function MenuItemList({
	items,
	onEditItem,
	onDeleteItem,
	onOpenModal,
}: MenuItemListProps) {
	return (
		<div className='space-y-6 bg-white shadow-md p-6 sm:p-8 border border-black/10 rounded'>
			<div className='flex sm:flex-row flex-col justify-between sm:items-center gap-4'>
				<FormHeader>Active Menu Items</FormHeader>
				<Button
					type='button'
					onClick={onOpenModal}
					className='flex justify-center items-center self-start sm:self-auto gap-2 bg-primary px-4 py-2 rounded font-black text-white'
				>
					<Plus size={18} /> Add New Item
				</Button>
			</div>

			{items.length === 0 ? (
				<p className='py-4 text-gray-500 text-sm text-center'>
					No menu items added yet.
				</p>
			) : (
				<div className='divide-y divide-gray-100'>
					{items.map(item => (
						<MenuItemCard
							key={item.id}
							item={item}
							onEdit={onEditItem}
							onDelete={onDeleteItem}
						/>
					))}
				</div>
			)}
		</div>
	);
}
