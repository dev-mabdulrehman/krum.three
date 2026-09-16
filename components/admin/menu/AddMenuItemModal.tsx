'use client';

import Button from '@/components/admin/Button';
import {
	AddMenuItemForm,
	ImageUploadItem,
	MenuFormData,
} from '@/components/admin/menu/AddMenuItemForm';
import { Modal } from '@/components/ui/Modal';
import { MenuItem } from '@/store/slices/menuSlice';
import { Loader2, Plus, Save } from 'lucide-react';
import { useState } from 'react';

interface AddMenuItemModalProps {
	isOpen: boolean;
	initialValues?: MenuItem | null;
	onClose: () => void;
	onSubmit: (
		data: MenuFormData,
		imageFiles?: ImageUploadItem[],
	) => Promise<void> | void;
}

export function AddMenuItemModal({
	isOpen,
	initialValues,
	onClose,
	onSubmit,
}: AddMenuItemModalProps) {
	const isEditing = Boolean(initialValues);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormSubmit = async (
		data: MenuFormData,
		imageFiles?: ImageUploadItem[],
	) => {
		try {
			setIsSubmitting(true);
			await onSubmit(data, imageFiles);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
			description={
				isEditing
					? 'Update the details below for this item.'
					: 'Fill out the form below to add a new item to your menu.'
			}
			maxWidth='lg'
			footer={
				<>
					<Button
						type='button'
						onClick={onClose}
						disabled={isSubmitting}
						className='bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-4 py-2 rounded font-semibold text-gray-700'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						form='menu-item-form'
						disabled={isSubmitting}
						className='flex justify-center items-center gap-2 bg-primary disabled:bg-primary/50 px-4 py-2 rounded font-black text-white'
					>
						{isSubmitting ? (
							<>
								<Loader2 size={18} className='animate-spin' />
								<span>Saving...</span>
							</>
						) : (
							<>
								{isEditing ? (
									<Save size={18} />
								) : (
									<Plus size={18} />
								)}
								<span>
									{isEditing ? 'Update Item' : 'Add Item'}
								</span>
							</>
						)}
					</Button>
				</>
			}
		>
			<AddMenuItemForm
				initialValues={initialValues}
				onSubmit={handleFormSubmit}
			/>
		</Modal>
	);
}
