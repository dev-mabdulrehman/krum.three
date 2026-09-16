'use client';

import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { MenuItem } from '@/types';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import Stars from '../Stars';

interface MenuItemCardProps {
	item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
	const dispatch = useAppDispatch();
	const [quantity, setQuantity] = useState<number>(1);

	const firstImg = item?.imgs?.[0];
	const secondImg = item?.imgs?.[2] || item?.imgs?.[1] || firstImg;
	const hasMultipleImages = Boolean(item?.imgs && item.imgs.length > 1);

	const handleDecrement = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setQuantity(prev => (prev > 1 ? prev - 1 : 1));
	};

	const handleIncrement = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setQuantity(prev => prev + 1);
	};

	const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(
			addToCart({
				id: item.id,
				name: item.name,
				price: Number(item.price.toString().replaceAll('PKR', '')),
				img: item.imgs[0]?.src || '',
				qty: quantity,
			}),
		);
		setQuantity(1);
	};

	return (
		<Link
			href={`/cookie/${item.id}`}
			className='group flex flex-col justify-between bg-surface-container-low shadow-sm hover:shadow-xl p-space-md rounded-2xl transition-all duration-300 cookie-card'
			data-id={item.id}
		>
			<div>
				{/* 3D Flip Container */}
				<div className='relative bg-surface-container shadow-inner mb-space-sm rounded-xl w-full aspect-square overflow-hidden [perspective:1000px]'>
					{/* Inner Rotating Wrapper */}
					<div
						className={`relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform ${hasMultipleImages ? 'group-hover:[transform:rotateY(180deg)]' : ''}`}
					>
						{/* Front Image */}
						<div className='absolute inset-0 w-full h-full [backface-visibility:hidden]'>
							{firstImg?.src ? (
								<Image
									alt={firstImg.alt || item.name}
									className='w-full h-full object-cover'
									src={firstImg.src}
									fill
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/>
							) : (
								<div className='bg-surface-variant w-full h-full' />
							)}
						</div>

						{/* Back Image (Shown on Hover) */}
						{hasMultipleImages && (
							<div className='absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]'>
								<Image
									alt={secondImg?.alt || item.name}
									className='w-full h-full object-cover'
									src={secondImg.src}
									fill
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/>
							</div>
						)}
					</div>

					{/* Overlay Badges */}
					<div className='top-3 left-3 z-10 absolute flex flex-wrap gap-1 pointer-events-none'>
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
						<div className='top-3 right-3 z-10 absolute pointer-events-none'>
							<span className='bg-surface-container-lowest shadow-xs px-2 py-0.5 rounded-full font-label-sm font-semibold text-label-sm text-primary'>
								{item.stockStatus}
							</span>
						</div>
					)}
				</div>

				{/* Content Section */}
				<div className='flex flex-col gap-space-2xs'>
					<div className='flex justify-between items-baseline gap-space-xs'>
						<h3 className='font-headline-sm font-semibold text-headline-sm text-primary leading-tight'>
							{item.name}
						</h3>
					</div>
					<div className='flex flex-row items-center gap-1'>
						<small>Reviews:</small>
						<Stars rating={3} />
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
		</Link>
	);
}

export function MenuItemCardSkeleton() {
	return (
		<div className='flex flex-col justify-between bg-[#f8f6f0] p-4 border border-black/5 rounded-3xl w-full max-w-[320px] animate-pulse'>
			<div>
				<div className='relative bg-[#1e4d40]/20 mb-4 rounded-2xl w-full aspect-square overflow-hidden'>
					<div className='top-3 right-3 left-3 absolute flex justify-between items-center'>
						<div className='bg-white/40 rounded-full w-12 h-5' />
						<div className='bg-white/40 rounded-full w-24 h-6' />
					</div>
					<div className='flex justify-center items-center h-full'>
						<div className='bg-white/20 rounded-full w-32 h-32' />
					</div>
				</div>

				<div className='flex flex-col gap-1.5 px-1'>
					<div className='bg-gray-300/60 rounded-md w-3/4 h-7' />
					<div className='bg-amber-800/20 mt-0.5 rounded-md w-2/5 h-6' />
					<div className='bg-gray-300/50 mt-1 rounded-md w-1/2 h-4' />
				</div>
			</div>

			<div className='flex items-center gap-3 mt-5 px-1'>
				<div className='flex items-center bg-gray-200/60 p-1 rounded-2xl w-[120px] h-12'>
					<div className='bg-white rounded-xl w-9 h-9' />
					<div className='flex-1 bg-gray-300/60 mx-auto rounded w-4 h-5' />
					<div className='bg-white rounded-xl w-9 h-9' />
				</div>

				<div className='flex-1 bg-[#1e4d40]/30 rounded-2xl h-12' />
			</div>
		</div>
	);
}
