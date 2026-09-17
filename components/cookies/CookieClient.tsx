'use client';

import ReviewsSection from '@/components/home/ReviewSection';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { MenuItem } from '@/types';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Stars from '../Stars';

interface CookieClientProps {
	item: MenuItem;
}

export default function CookieClient({ item }: CookieClientProps) {
	const dispatch = useAppDispatch();
	const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(1);

	const images = item.imgs?.slice(0, 4) || [];
	const currentImg = images[selectedImgIndex] || images[0];

	const handleDecrement = () =>
		setQuantity(prev => (prev > 1 ? prev - 1 : 1));
	const handleIncrement = () => setQuantity(prev => prev + 1);

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				id: item.id,
				name: item.name,
				price: Number(item.price.toString().replaceAll('PKR', '')),
				img: currentImg?.src || '',
				qty: quantity,
			}),
		);
		setQuantity(1);
	};

	return (
		<main className='mx-auto px-4 py-8 max-w-6xl container'>
			<div className='items-start gap-8 lg:gap-12 grid grid-cols-1 lg:grid-cols-2'>
				{/* Image Gallery */}
				<div className='flex flex-col gap-4'>
					<div className='relative bg-surface-container shadow-sm rounded-2xl w-full aspect-square overflow-hidden'>
						{currentImg?.src && (
							<Image
								src={currentImg.src}
								alt={currentImg.alt || item.name}
								fill
								priority
								className='object-cover'
								sizes='(max-width: 1024px) 100vw, 50vw'
							/>
						)}
					</div>

					{/* Thumbnails */}
					<div className='gap-3 grid grid-cols-4'>
						{images.map((img, idx) => (
							<button
								key={idx}
								type='button'
								onClick={() => setSelectedImgIndex(idx)}
								className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
									selectedImgIndex === idx
										? 'border-primary ring-2 ring-primary/20 scale-95'
										: 'border-transparent opacity-70 hover:opacity-100'
								}`}
							>
								<Image
									src={img.src}
									alt={img.alt || `Thumbnail ${idx + 1}`}
									fill
									className='object-cover'
									sizes='15vw'
								/>
							</button>
						))}
					</div>
				</div>

				{/* Details & Controls */}
				<div className='flex flex-col gap-6'>
					{item.stockStatus && (
						<div>
							<span className='inline-block bg-surface-container-high px-3 py-1 rounded-full font-semibold text-primary text-xs'>
								{item.stockStatus}
							</span>
						</div>
					)}

					<h1 className='font-bold text-primary text-3xl lg:text-4xl leading-tight'>
						{item.name}
					</h1>

					<div className='flex flex-row items-center gap-1'>
						<small>Reviews:</small>
						<Stars rating={item.productRating?.averageRating || 0} />

						<span className='font-bold text-on-surface text-sm'>
							{item.productRating?.averageRating.toFixed(1) || 'N/A'}
						</span>
						<span className='text-on-surface-variant text-sm'>
							({item.productRating?.totalReviews || 0} reviews)
						</span>
					</div>

					<div className='flex items-baseline gap-3'>
						<span className='font-extrabold text-secondary text-3xl'>
							PKR {item.price.toLocaleString()}
						</span>
						{item.weight && (
							<span className='text-on-surface-variant text-sm'>
								/ {item.weight}
							</span>
						)}
					</div>

					<p className='text-body-lg text-on-surface-variant leading-relaxed'>
						{item.description}
					</p>

					<hr className='my-2 border-surface-variant' />

					<div className='flex sm:flex-row flex-col gap-4'>
						<div className='flex justify-between items-center bg-surface-container shadow-inner p-1.5 rounded-2xl w-full sm:w-36'>
							<button
								type='button'
								aria-label='Decrease quantity'
								onClick={handleDecrement}
								className='flex justify-center items-center bg-surface-container-lowest hover:bg-surface-variant rounded-xl w-10 h-10 text-on-surface active:scale-95 transition-all'
							>
								<Minus size={18} />
							</button>
							<span className='font-bold text-on-surface text-lg'>
								{quantity}
							</span>
							<button
								type='button'
								aria-label='Increase quantity'
								onClick={handleIncrement}
								className='flex justify-center items-center bg-surface-container-lowest hover:bg-surface-variant rounded-xl w-10 h-10 text-on-surface active:scale-95 transition-all'
							>
								<Plus size={18} />
							</button>
						</div>

						<button
							type='button'
							onClick={handleAddToCart}
							className='flex flex-1 justify-center items-center gap-2 bg-primary hover:bg-primary-container shadow-md px-6 py-3.5 rounded-2xl font-bold text-on-primary text-base active:scale-95 transition-all'
						>
							<ShoppingBag size={20} />
							<span>Add to Cart</span>
						</button>
					</div>
				</div>

				<div className='col-span-1 lg:col-span-2'>
					<ReviewsSection productRating={item.productRating} slug={item.slug} />
				</div>
			</div>
		</main>
	);
}
