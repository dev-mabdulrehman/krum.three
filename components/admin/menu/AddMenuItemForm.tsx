'use client';

import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import { MenuItem } from '@/store/slices/menuSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Award,
	Cookie,
	DollarSign,
	FileText,
	Image as ImageIcon,
	Layers,
	Plus,
	Save,
	Scale,
	Sparkles,
	Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const menuSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	price: z
		.number({ message: 'Price must be a valid number' })
		.min(1, 'Price must be greater than 0'),
	weight: z.string().min(1, 'Weight is required'),
	description: z.string().min(1, 'Description is required'),
	stockStatus: z.string().min(1, 'Stock status is required'),
	badge: z.string().optional(),
	imgSrc: z.string().optional(),
	imgAlt: z.string().optional(),
});

export type MenuFormData = z.infer<typeof menuSchema>;

interface AddMenuItemFormProps {
	initialValues?: MenuItem | null;
	onSubmit: (data: MenuFormData, imageFile?: File) => void;
	onCancel?: () => void;
}

export function AddMenuItemForm({
	initialValues,
	onSubmit,
	onCancel,
}: AddMenuItemFormProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>(
		initialValues?.imgSrc || '',
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<MenuFormData>({
		resolver: zodResolver(menuSchema),
		defaultValues: {
			name: '',
			price: 0,
			weight: '',
			description: '',
			stockStatus: 'Fresh Today',
			badge: '',
			imgSrc: '',
			imgAlt: '',
		},
	});

	useEffect(() => {
		if (initialValues) {
			reset({
				name: initialValues.name,
				price: initialValues.price,
				weight: initialValues.weight,
				description: initialValues.description,
				stockStatus: initialValues.stockStatus,
				badge: initialValues.badge || '',
				imgSrc: initialValues.imgSrc || '',
				imgAlt: initialValues.imgAlt || '',
			});
			setPreviewUrl(initialValues.imgSrc || '');
		} else {
			reset({
				name: '',
				price: 0,
				weight: '',
				description: '',
				stockStatus: 'Fresh Today',
				badge: '',
				imgSrc: '',
				imgAlt: '',
			});
			setPreviewUrl('');
		}
		setSelectedFile(null);
	}, [initialValues, reset]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleFormSubmit = (data: MenuFormData) => {
		onSubmit(data, selectedFile || undefined);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
			<Input
				placeholder='Name (e.g. Very Velvet)'
				icon={<Cookie size={18} />}
				error={errors.name?.message}
				{...register('name')}
			/>

			<div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
				<Input
					type='number'
					step='0.01'
					placeholder='Price (e.g. 350)'
					icon={<DollarSign size={18} />}
					error={errors.price?.message}
					{...register('price', { valueAsNumber: true })}
				/>

				<Input
					placeholder='Weight (e.g. 100g)'
					icon={<Scale size={18} />}
					error={errors.weight?.message}
					{...register('weight')}
				/>
			</div>

			<div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
				<Input
					placeholder='Stock Status (e.g. Fresh Today)'
					icon={<Layers size={18} />}
					error={errors.stockStatus?.message}
					{...register('stockStatus')}
				/>

				<Input
					placeholder='Badge (e.g. Bestseller)'
					icon={<Award size={18} />}
					error={errors.badge?.message}
					{...register('badge')}
				/>
			</div>

			{/* Description Input */}
			<div className='flex flex-col gap-1 w-full'>
				<div className='relative flex items-start border border-black/10 rounded'>
					<span className='top-3 left-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 pointer-events-none'>
						<FileText size={18} />
					</span>
					<textarea
						rows={3}
						placeholder='Description (e.g. 70% Valrhona dark chocolate...)'
						className='p-2 pl-9 border-none rounded outline-none w-full text-sm resize-none'
						{...register('description')}
					/>
				</div>
				{errors.description?.message && (
					<span className='font-medium text-red-500 text-xs'>
						{errors.description.message}
					</span>
				)}
			</div>

			{/* File Upload / Image Picker */}
			<div className='space-y-2'>
				<label className='block font-semibold text-gray-600 text-xs'>
					Item Image
				</label>
				<div className='flex items-center gap-4'>
					{previewUrl ? (
						<div className='relative border rounded w-16 h-16 overflow-hidden shrink-0'>
							<img
								src={previewUrl}
								alt='Preview'
								className='w-full h-full object-cover'
							/>
						</div>
					) : (
						<div className='flex justify-center items-center bg-gray-100 border rounded w-16 h-16 text-gray-400 shrink-0'>
							<ImageIcon size={24} />
						</div>
					)}
					<label className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 border rounded font-semibold text-gray-700 text-xs transition cursor-pointer'>
						<Upload size={16} /> Choose File
						<input
							type='file'
							accept='image/*'
							className='hidden'
							onChange={handleFileChange}
						/>
					</label>
				</div>
			</div>

			<Input
				placeholder='Image Alt Text (imgAlt)'
				icon={<Sparkles size={18} />}
				error={errors.imgAlt?.message}
				{...register('imgAlt')}
			/>

			<div className='flex lg:flex-row flex-col-reverse justify-end items-center gap-3 pt-4 border-black/10 border-t'>
				{onCancel && (
					<Button
						type='button'
						onClick={onCancel}
						className='bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded font-semibold text-gray-700'
					>
						Cancel
					</Button>
				)}
				<Button
					type='submit'
					disabled={isSubmitting}
					className='flex justify-center items-center gap-2 bg-primary disabled:bg-primary/20 px-4 py-2 rounded font-black text-white'
				>
					{initialValues ? <Save size={18} /> : <Plus size={18} />}
					{initialValues ? 'Update Item' : 'Add Item'}
				</Button>
			</div>
		</form>
	);
}
