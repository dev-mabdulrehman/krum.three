'use client';

import Input from '@/components/admin/Input';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { slugify } from '@/lib/utils';
import menuSchema from '@/schema/menuSchema';
import { MenuFormData, MenuItem, MixedImageData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Award,
	Banknote,
	Cookie,
	FileText,
	Layers,
	Link,
	Scale,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';


interface AddMenuItemFormProps {
	initialValues?: MenuItem | null;
	onSubmit: (
		data: MenuFormData,
		imagesData: MixedImageData[],
		coverIndex: number,
	) => Promise<void> | void;
}

export function AddMenuItemForm({
	initialValues,
	onSubmit,
}: AddMenuItemFormProps) {
	const [imagesData, setImagesData] = useState<MixedImageData[]>([]);
	const [coverIndex, setCoverIndex] = useState<number>(0);
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, touchedFields, isSubmitted },
	} = useForm<MenuFormData>({
		resolver: zodResolver(menuSchema),
		mode: 'onTouched',
		defaultValues: {
			name: '',
			price: 0,
			weight: '',
			description: '',
			stockStatus: 'Fresh Today',
			badge: '',
			imgs: [],
			slug: '',
		},
	});

	const watchName = watch('name');

	// Auto-update slug unless manually edited
	useEffect(() => {
		if (!isSlugManuallyEdited) {
			setValue('slug', slugify(watchName || ''), {
				shouldValidate: true,
			});
		}
	}, [watchName, isSlugManuallyEdited, setValue]);

	useEffect(() => {
		if (initialValues) {
			reset(
				{
					name: initialValues.name,
					price: initialValues.price,
					weight: initialValues.weight,
					description: initialValues.description,
					stockStatus: initialValues.stockStatus,
					badge: initialValues.badge || '',
					slug:
						initialValues.slug || slugify(initialValues.name || ''),
					imgs: initialValues.imgs || [],
				},
				{ keepErrors: false, keepTouched: false },
			);
			setIsSlugManuallyEdited(true);
		} else {
			reset(
				{
					name: '',
					price: 0,
					weight: '',
					description: '',
					stockStatus: 'Fresh Today',
					badge: '',
					slug: '',
					imgs: [],
				},
				{ keepErrors: false, keepTouched: false },
			);
			setIsSlugManuallyEdited(false);
		}
	}, [initialValues, reset]);

	const handleImagesChange = (
		updatedImages: MixedImageData[],
		updatedCoverIndex: number,
	) => {
		setImagesData(updatedImages);
		setCoverIndex(updatedCoverIndex);
	};

	const handleFormSubmit = async (data: MenuFormData) => {
		await onSubmit(data, imagesData, coverIndex);
	};

	return (
		<form
			id='menu-item-form'
			onSubmit={handleSubmit(handleFormSubmit)}
			className='space-y-4'
		>
			<Input
				placeholder='Name (e.g. Very Velvet)'
				icon={<Cookie size={18} />}
				error={errors.name?.message}
				{...register('name')}
			/>

			<Input
				placeholder='Slug (e.g. very-velvet)'
				icon={<Link size={18} />}
				error={
					touchedFields.slug || isSubmitted
						? errors.slug?.message
						: undefined
				}
				{...register('slug', {
					onChange: e => {
						setIsSlugManuallyEdited(true);
						setValue('slug', slugify(e.target.value));
					},
				})}
			/>

			<div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
				<Input
					type='number'
					step='0.01'
					placeholder='Price (e.g. 350)'
					icon={<Banknote size={18} />}
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

			<div className='flex flex-col gap-1 w-full'>
				<div className='relative flex items-start border border-black/10 rounded'>
					<span className='top-3 left-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 pointer-events-none'>
						<FileText size={18} />
					</span>
					<textarea
						rows={3}
						placeholder='Description'
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

			<MultiImageUpload
				images={initialValues?.imgs || []}
				onChange={handleImagesChange}
			/>
		</form>
	);
}
