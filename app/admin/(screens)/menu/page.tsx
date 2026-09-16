'use client';

import {
	ImageUploadItem,
	MenuFormData,
} from '@/components/admin/menu/AddMenuItemForm';
import { AddMenuItemModal } from '@/components/admin/menu/AddMenuItemModal';
import { MenuItemList } from '@/components/admin/menu/MenuItemList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	addMenuItem,
	deleteMenuItem,
	fetchMenuItems,
	MenuItem,
	updateMenuItem,
} from '@/store/slices/menuSlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function MenuPage() {
	const dispatch = useAppDispatch();
	const { items: itemsMap, loading: itemsLoading } = useAppSelector(
		state => state.menu,
	);
	const menuItems = Object.values(itemsMap);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

	useEffect(() => {
		dispatch(fetchMenuItems());
	}, [dispatch]);

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
		imageFiles?: ImageUploadItem[],
	) => {
		// Create dispatch action promise based on create/edit mode
		const actionPromise = editingItem
			? dispatch(
					updateMenuItem({
						id: editingItem.id,
						data,
						imageFiles,
						oldImgSrc: editingItem.imgSrc,
					}),
				).unwrap()
			: dispatch(
					addMenuItem({
						...data,
						imgs: data.imgs ?? [],
						imageFiles,
					}),
				).unwrap();

		try {
			await toast.promise(actionPromise, {
				loading: 'Saving menu item...',
				success: 'Menu item saved successfully!',
				error: err =>
					typeof err === 'string'
						? err
						: err?.message || 'Failed to save menu item',
			});

			// Close modal ONLY on success
			handleCloseModal();
		} catch (err) {
			// Modal stays open when promise rejects, allowing user to retry or fix inputs
			console.error('Menu save error:', err);
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
				loading={itemsLoading}
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
