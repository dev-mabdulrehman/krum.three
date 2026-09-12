'use client';

import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { MenuItem } from '@/types';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MenuItemCardProps {
	item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
	const dispatch = useAppDispatch();
	const [quantity, setQuantity] = useState<number>(1);

	const handleDecrement = () => {
		setQuantity(prev => (prev > 1 ? prev - 1 : 1));
	};

	const handleIncrement = () => {
		setQuantity(prev => prev + 1);
	};

	const handleAddToCart = () => {
		console.log(item.price);
		dispatch(
			addToCart({
				id: item.id,
				name: item.name,
				price: Number(item.price.toString().replaceAll('PKR', '')),
				img: item.imgSrc,
				qty: quantity,
			}),
		);
		setQuantity(1);
	};

	return (
		<div
			className='group flex flex-col justify-between bg-surface-container-low shadow-sm hover:shadow-xl p-space-md rounded-2xl transition-all duration-300 cookie-card'
			data-id={item.id}
		>
			<div>
				{/* Card Image Container */}
				<div className='relative bg-surface-container shadow-inner mb-space-sm rounded-xl w-full aspect-square overflow-hidden'>
					<Image
						alt={item.imgAlt}
						className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
						src={item.imgSrc}
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>

					{/* Badges Overlay */}
					<div className='top-3 left-3 z-10 absolute flex flex-wrap gap-1'>
						{item.badge && (
							<span className='bg-secondary px-2.5 py-0.5 rounded-full font-label-sm font-bold text-label-sm text-on-secondary uppercase'>
								{item.badge}
							</span>
						)}
						{item.weight && (
							<span className='bg-primary-container/80 backdrop-blur-xs px-2 py-0.5 rounded-full font-label-sm text-label-sm text-on-primary'>
								{item.weight}
							</span>
						)}
					</div>

					{/* Stock Tag */}
					{item.stockStatus && (
						<div className='top-3 right-3 z-10 absolute'>
							<span className='bg-surface-container-lowest shadow-xs px-2 py-0.5 rounded-full font-label-sm font-semibold text-label-sm text-primary'>
								{item.stockStatus}
							</span>
						</div>
					)}
				</div>

				{/* Content Section */}
				<div className='flex flex-col gap-space-2xs'>
					<div className='flex justify-between items-baseline gap-space-xs'>
						<h3 className='font-headline-sm text-headline-sm text-primary leading-tight'>
							{item.name}
						</h3>
					</div>
					<p className='font-title-md font-bold text-secondary text-title-md'>
						PKR {item.price.toLocaleString()}
					</p>
					<p className='font-body-md text-body-md text-on-surface-variant line-clamp-3'>
						{item.description}
					</p>
				</div>
			</div>

			{/* Actions / Quantity Selector */}
			<div className='flex justify-between items-center gap-space-xs mt-space-md pt-space-xs'>
				<div className='flex items-center bg-surface-container shadow-inner p-1 rounded-xl'>
					<button
						type='button'
						aria-label='Decrease quantity'
						onClick={handleDecrement}
						className='flex justify-center items-center bg-surface-container-lowest hover:bg-surface-variant rounded-lg w-8 h-8 text-on-surface active:scale-95 transition-all'
					>
						<Minus size={16} />
					</button>
					<span className='w-8 font-label-md font-bold text-label-md text-on-surface text-center'>
						{quantity}
					</span>
					<button
						type='button'
						aria-label='Increase quantity'
						onClick={handleIncrement}
						className='flex justify-center items-center bg-surface-container-lowest hover:bg-surface-variant rounded-lg w-8 h-8 text-on-surface active:scale-95 transition-all'
					>
						<Plus size={16} />
					</button>
				</div>

				<button
					type='button'
					onClick={handleAddToCart}
					className='inline-flex flex-1 justify-center items-center gap-space-2xs bg-primary hover:bg-primary-container shadow-sm px-space-sm py-2.5 rounded-xl font-label-md text-label-md text-on-primary active:scale-95 transition-all'
				>
					<ShoppingBag size={18} />
					<span>Add</span>
				</button>
			</div>
		</div>
	);
}
