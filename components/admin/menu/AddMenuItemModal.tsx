'use client';

import { MenuItem } from '@/store/slices/menuSlice';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { AddMenuItemForm, MenuFormData } from './AddMenuItemForm';

interface AddMenuItemModalProps {
	isOpen: boolean;
	initialValues?: MenuItem | null;
	onClose: () => void;
	onSubmit: (data: MenuFormData, imageFile?: File) => void;
}

export function AddMenuItemModal({
	isOpen,
	initialValues,
	onClose,
	onSubmit,
}: AddMenuItemModalProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className='z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4'>
			<div className='flex flex-col bg-white shadow-xl border border-black/10 rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden animate-in duration-150 fade-in zoom-in-95'>
				<div className='flex justify-between items-center p-4 sm:p-6 border-black/10 border-b'>
					<h3 className='font-black text-gray-900 text-lg'>
						{initialValues ? 'Edit Menu Item' : 'Add New Item'}
					</h3>
					<button
						type='button'
						onClick={onClose}
						className='p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors'
					>
						<X size={20} />
					</button>
				</div>

				<div className='flex-1 p-4 sm:p-6 overflow-y-auto'>
					<AddMenuItemForm
						initialValues={initialValues}
						onSubmit={onSubmit}
						onCancel={onClose}
					/>
				</div>
			</div>
		</div>
	);
}
