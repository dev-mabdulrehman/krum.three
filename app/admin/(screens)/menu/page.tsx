'use client';

import { MenuFormData } from '@/components/admin/menu/AddMenuItemForm';
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

export default function MenuPage() {
	const dispatch = useAppDispatch();
	const { items: itemsMap } = useAppSelector(state => state.menu);
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

	const handleSubmit = async (data: MenuFormData, imageFile?: File) => {
		if (editingItem) {
			await dispatch(
				updateMenuItem({
					id: editingItem.id,
					data,
					imageFile,
					oldImgSrc: editingItem.imgSrc
				}),
			);
		} else {
			await dispatch(
				addMenuItem({
					...data,
					imageFile,
				}),
			);
		}
		handleCloseModal();
	};

	const handleDeleteItem = (item: MenuItem) => {
		dispatch(deleteMenuItem(item));
	};

	return (
		<div className='space-y-6 mx-auto max-w-5xl'>
			<MenuItemList
				items={menuItems}
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
