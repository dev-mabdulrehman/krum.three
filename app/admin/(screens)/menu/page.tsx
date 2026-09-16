'use client';

import { MenuFormData } from '@/components/admin/menu/AddMenuItemForm';
import { AddMenuItemModal } from '@/components/admin/menu/AddMenuItemModal';
import { MenuItemList } from '@/components/admin/menu/MenuItemList';
import { useFirestoreSubscription } from '@/hooks/useFirestoreSubscription';
import { useAppDispatch } from '@/store/hooks';
import {
	addMenuItem,
	deleteMenuItem,
	updateMenuItem,
} from '@/store/slices/menuSlice';
import { MenuItem, MixedImageData } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MenuPage() {
	const dispatch = useAppDispatch();
	const {
		loading: menuItemsLoading,
		data: menuItemsData,
		error: menuItemsError,
	} = useFirestoreSubscription<MenuItem>('menuItems', []);
	const menuItems = Object.values(menuItemsData);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

	const handleOpenAddModal = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (item: MenuItem) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingItem(null);
	};

	const handleSubmit = async (
		data: MenuFormData,
		imagesData: MixedImageData[],
		coverIndex: number = 0,
	) => {
		// Determine action based on edit vs. create mode
		const actionPromise = editingItem
			? dispatch(
					updateMenuItem({
						id: editingItem.id,
						data,
						imagesData,
						coverIndex,
						// Pass old images so async thunk can delete removed assets from Firebase Storage
						oldImgs: editingItem.imgs ?? [],
					}),
				).unwrap()
			: dispatch(
					addMenuItem({
						data,
						imagesData,
						coverIndex,
					}),
				).unwrap();
		const voidActionPromise: Promise<void> = actionPromise.then(
			() => undefined,
		);

		try {
			await toast.promise(voidActionPromise, {
				loading: editingItem
					? 'Updating menu item...'
					: 'Saving menu item...',
				success: editingItem
					? 'Menu item updated successfully!'
					: 'Menu item created successfully!',
				error: err =>
					typeof err === 'string'
						? err
						: err?.message || 'Failed to save menu item',
			});

			// Close modal ONLY on success
			handleCloseModal();
		} catch (err) {
			// Modal stays open on error so the user can fix errors or retry
			console.error('Menu submit error:', err);
		}
	};

	const handleDeleteItem = async (item: MenuItem) => {
		try {
			await toast.promise(dispatch(deleteMenuItem(item)).unwrap(), {
				loading: 'Deleting item...',
				success: 'Menu item deleted!',
				error: err =>
					typeof err === 'string'
						? err
						: err?.message || 'Failed to delete item',
			});
		} catch (err) {
			console.error('Delete error:', err);
		}
	};

	return (
		<div className='space-y-6 mx-auto max-w-5xl'>
			<MenuItemList
				items={menuItems}
				loading={menuItemsLoading}
				onEditItem={handleOpenEditModal}
				onDeleteItem={handleDeleteItem}
				onOpenModal={handleOpenAddModal}
			/>

			<AddMenuItemModal
				isOpen={isModalOpen}
				initialValues={editingItem}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
