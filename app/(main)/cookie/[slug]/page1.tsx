'use client';

import ReviewsSection from '@/components/home/ReviewSection';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { MenuItem } from '@/types';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import { use, useState } from 'react';

// Mock data — replace this with your actual database/API fetch logic
const MOCK_ITEM: MenuItem = {
	id: 'double-chocolate-fudge-cookie',
	name: 'Double Chocolate Fudge Cookie',
	price: 450,
	description:
		'Indulge in rich, dark chocolate dough folded with melted Belgian chocolate chunks and topped with a light sprinkle of sea salt. Baked fresh daily for a crispy edge and a gooey center.',
	weight: '120g',
	badge: 'Bestseller',
	slug: 'double-chocolate-fudge-cookie',
	stockStatus: 'In Stock',
	imgs: [
		{
			src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
			alt: 'Main Cookie',
		},
		{
			src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
			alt: 'Cookie side view',
		},
		{
			src: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800',
			alt: 'Broken cookie center',
		},
		{
			src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
			alt: 'Cookie stack',
		},
	],
};

interface CookiePageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default function CookiePage({ params }: CookiePageProps) {
	// Unwrap route params
	const { slug } = use(params);

	// Replace with real fetching logic based on `slug`:
	const item = MOCK_ITEM;

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
				{/* LEFT: Image Gallery Section (4 Images Total) */}
				<div className='flex flex-col gap-4'>
					{/* Main Featured Image */}
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

						{/* Badges */}
						<div className='top-4 left-4 z-10 absolute flex flex-wrap gap-2'>
							{item.badge && (
								<span className='bg-secondary px-3 py-1 rounded-full font-bold text-on-secondary text-xs uppercase'>
									{item.badge}
								</span>
							)}
							{item.weight && (
								<span className='bg-primary-container/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-on-primary text-xs'>
									{item.weight}
								</span>
							)}
						</div>
					</div>

					{/* 4 Thumbnails Strip */}
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
				{/* RIGHT: Product Details & Purchase Controls */}
				<div className='flex flex-col gap-6'>
					{/* Stock Status */}
					{item.stockStatus && (
						<div>
							<span className='inline-block bg-surface-container-high px-3 py-1 rounded-full font-semibold text-primary text-xs'>
								{item.stockStatus}
							</span>
						</div>
					)}

					{/* Title */}
					<h1 className='font-bold text-primary text-3xl lg:text-4xl leading-tight'>
						{item.name}
					</h1>

					{/* Star Rating & Reviews */}
					<div className='flex items-center gap-2'>
						<div className='flex items-center text-amber-500'>
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={18}
									className={
										i < 4
											? 'fill-amber-400 text-amber-400'
											: 'text-gray-300'
									}
								/>
							))}
						</div>
						<span className='font-bold text-on-surface text-sm'>
							4.8
						</span>
						<span className='text-on-surface-variant text-sm'>
							(124 reviews)
						</span>
					</div>

					{/* Price & Weight */}
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

					{/* Description */}
					<p className='text-body-lg text-on-surface-variant leading-relaxed'>
						{item.description}
					</p>

					<hr className='my-2 border-surface-variant' />

					{/* Actions: Quantity Selector + Add to Cart */}
					<div className='flex sm:flex-row flex-col gap-4'>
						{/* Quantity Controls */}
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

						{/* Add to Cart Button */}
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
					<ReviewsSection />
				</div>
			</div>
		</main>
	);
}
