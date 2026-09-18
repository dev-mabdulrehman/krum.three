'use client';

import Button from '@/components/admin/Button';
import Input from '@/components/admin/Input';
import { useAppSelector } from '@/store/hooks';
import { MenuItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Box,
	Globe,
	Hash,
	Phone,
	Plus,
	ShoppingBag,
	Trash2,
	User,
} from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const pakMobileRegex =
	/^(?:(?:\+92|0092)?\(?0?\)?\d{3}\)?[\s.-]?\d{7}|03\d{2}[-.\s]?\d{7}|03\d{9})$/;

export const orderItemSchema = z.object({
	itemId: z.string().min(1, 'Please select an item'),
	qtyCount: z
		.number({ message: 'Quantity must be a valid number' })
		.min(1, 'Min quantity is 1'),
	unit: z.string().min(1, 'Unit required'),
	piecePrice: z
		.number({ message: 'Piece price must be a valid number' })
		.min(0, 'Piece price cannot be negative'),
});

export const orderSchema = z.object({
	source: z.string().min(1, 'Source platform is required'),
	customer: z.string().min(1, 'Customer name is required'),
	customer_contact: z
		.string()
		.min(1, 'Contact number is required')
		.regex(
			pakMobileRegex,
			'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)',
		),
	items: z
		.array(orderItemSchema)
		.min(1, 'At least one item is required in the order'),
});

export type OrderFormData = z.infer<typeof orderSchema>;

const Option = 'option';

interface AddOrderFormProps {
	onSubmit: (data: OrderFormData) => Promise<void> | void;
	onCancel?: () => void;
}

export function AddOrderForm({ onSubmit, onCancel }: AddOrderFormProps) {
	const { items: menuData, loading } = useAppSelector(state => state.menu);
	const menuItems = Object.values(menuData);

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<OrderFormData>({
		resolver: zodResolver(orderSchema),
		mode: 'onTouched',
		defaultValues: {
			source: 'Phone/Manual',
			customer: '',
			customer_contact: '',
			items: [
				{
					itemId: '',
					qtyCount: 1,
					unit: 'Piece',
					piecePrice: 0,
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	// 1. Watch all items safely at the top level
	const watchedItems = useWatch({
		control,
		name: 'items',
	});

	// 2. Automatically sync piecePrice whenever itemId changes
	useEffect(() => {
		if (!watchedItems) return;

		watchedItems.forEach((item, index) => {
			console.log('Watched Item:', item, 'at index', index);
			if (!item?.itemId) return;

			const selectedMenuItem = menuItems.find(m => m.id === item.itemId);
			if (
				selectedMenuItem &&
				item.piecePrice !== selectedMenuItem.price
			) {
				setValue(`items.${index}.piecePrice`, selectedMenuItem.price, {
					shouldValidate: true,
					shouldDirty: true,
				});
			}
		});
	}, [watchedItems, menuItems, setValue]);

	const handleFormSubmit = async (data: OrderFormData) => {
		console.log('Form Data:', data);
		await onSubmit(data);
	};

	return (
		<form
			id='add-order-form'
			onSubmit={handleSubmit(handleFormSubmit)}
			className='space-y-4'
		>
			{/* Platform / Source Select */}
			<div className='flex flex-col gap-1 w-full'>
				<label className='block font-medium text-gray-700 text-xs uppercase'>
					Platform / Source
				</label>
				<div className='relative flex items-center border border-black/10 rounded'>
					<span className='left-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 pointer-events-none'>
						<Globe size={18} />
					</span>
					<select
						{...register('source')}
						className='bg-white p-2 pl-9 rounded outline-none w-full text-sm appearance-none cursor-pointer'
					>
						<Option value='Phone/Manual'>Phone Order</Option>
						<Option value='Instagram'>Instagram</Option>
						<Option value='Whatsapp'>WhatsApp</Option>
						<Option value='Facebook'>Facebook</Option>
					</select>
				</div>
				{errors.source?.message && (
					<span className='font-medium text-red-500 text-xs'>
						{errors.source.message}
					</span>
				)}
			</div>

			{/* Customer Name */}
			<div className='flex flex-col gap-1 w-full'>
				<label className='block font-medium text-gray-700 text-xs uppercase'>
					Customer Name
				</label>
				<Input
					placeholder='e.g. Jane Doe'
					icon={<User size={18} />}
					error={errors.customer?.message}
					{...register('customer')}
				/>
			</div>

			{/* Customer Contact */}
			<div className='flex flex-col gap-1 w-full'>
				<label className='block font-medium text-gray-700 text-xs uppercase'>
					Customer Contact
				</label>
				<Input
					placeholder='e.g. 03001234567'
					icon={<Phone size={18} />}
					error={errors.customer_contact?.message}
					{...register('customer_contact')}
				/>
			</div>

			{/* Dynamic Items Section */}
			<div className='space-y-3 pt-2'>
				<div className='flex justify-between items-center'>
					<label className='block font-medium text-gray-700 text-xs uppercase'>
						Order Items
					</label>
					<button
						type='button'
						onClick={() =>
							append({
								itemId: '',
								qtyCount: 1,
								unit: 'Piece',
								piecePrice: 0,
							})
						}
						className='flex items-center gap-1 font-medium text-primary text-xs hover:underline'
					>
						<Plus size={14} /> Add Item
					</button>
				</div>

				{errors.items?.root?.message && (
					<span className='font-medium text-red-500 text-xs'>
						{errors.items.root.message}
					</span>
				)}

				{fields.map((field, index) => (
					<div
						key={field.id}
						className='relative space-y-2 bg-gray-50/50 p-3 border border-black/10 rounded-md'
					>
						<div className='flex justify-between items-center'>
							<span className='font-semibold text-gray-500 text-xs'>
								Item #{index + 1}
							</span>
							{fields.length > 1 && (
								<button
									type='button'
									onClick={() => remove(index)}
									className='text-red-500 hover:text-red-700 transition-colors'
									title='Remove item'
								>
									<Trash2 size={16} />
								</button>
							)}
						</div>

						{/* Menu Item Dropdown */}
						<div className='flex flex-col gap-1 w-full'>
							<div className='relative flex items-center bg-white border border-black/10 rounded'>
								<span className='left-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 pointer-events-none'>
									<ShoppingBag size={18} />
								</span>
								<select
									{...register(`items.${index}.itemId`, {
										// 3. Instant price sync on drop-down selection
										onChange: e => {
											const selectedId = e.target.value;
											const matched = menuItems.find(
												m => m.id === selectedId,
											);
											if (matched) {
												setValue(
													`items.${index}.piecePrice`,
													matched.price,
													{ shouldValidate: true },
												);
											}
										},
									})}
									className='bg-transparent p-2 pl-9 rounded outline-none w-full text-sm appearance-none cursor-pointer'
								>
									<option value='' disabled>
										Select Menu Item
									</option>
									{!loading &&
										menuItems.map((item: MenuItem) => (
											<option
												key={item.id}
												value={item.id}
											>
												{item.name} (${item.price})
											</option>
										))}
								</select>
							</div>
							{errors.items?.[index]?.itemId?.message && (
								<span className='font-medium text-red-500 text-xs'>
									{errors.items[index]?.itemId?.message}
								</span>
							)}
						</div>

						{/* Quantity & Unit Row */}
						<div className='gap-2 grid grid-cols-2'>
							<div className='flex flex-col gap-1 w-full'>
								<Input
									type='number'
									min={1}
									placeholder='Qty'
									icon={<Hash size={18} />}
									error={
										errors.items?.[index]?.qtyCount?.message
									}
									{...register(`items.${index}.qtyCount`, {
										valueAsNumber: true,
									})}
								/>
							</div>

							<div className='flex flex-col gap-1 w-full'>
								<div className='relative flex items-center bg-white border border-black/10 rounded'>
									<span className='left-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 pointer-events-none'>
										<Box size={18} />
									</span>
									<select
										{...register(`items.${index}.unit`)}
										className='bg-transparent p-2 pl-9 rounded outline-none w-full text-sm appearance-none cursor-pointer'
									>
										<option value='Box'>Box</option>
										<option value='Piece'>Piece</option>
										<option value='Tray'>Tray</option>
									</select>
								</div>
								{errors.items?.[index]?.unit?.message && (
									<span className='font-medium text-red-500 text-xs'>
										{errors.items[index]?.unit?.message}
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Submit Controls */}
			{onCancel && (
				<div className='flex justify-end gap-2 pt-2'>
					<Button
						type='button'
						onClick={onCancel}
						className='bg-gray-100 text-gray-700 text-xs'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={isSubmitting}
						className='bg-primary text-white text-xs'
					>
						{isSubmitting ? 'Creating...' : 'Create Order'}
					</Button>
				</div>
			)}
		</form>
	);
}
