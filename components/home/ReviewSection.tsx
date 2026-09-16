'use client';

import { Star, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import AddReviewModal from './AddReviewModal';

export interface ReviewItem {
	id: string;
	author: string;
	rating: number;
	date: string;
	comment: string;
	images?: string[];
	likes?: number;
}

const INITIAL_REVIEWS: ReviewItem[] = [
	{
		id: '1',
		author: 'Ahmed K.',
		rating: 5,
		date: '2 days ago',
		comment:
			'Absolutely amazing taste! Perfectly soft on the inside with crispy edges. Arrived warm and freshly packaged.',
		images: [
			'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
			'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500',
		],
		likes: 12,
	},
	{
		id: '2',
		author: 'Fatima N.',
		rating: 4,
		date: '1 week ago',
		comment:
			'Great flavor, rich chocolate. A bit on the sweet side for me, but overall very high quality.',
		likes: 4,
	},
];

export default function ReviewsSection() {
	const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [activeImage, setActiveImage] = useState<string | null>(null);

	const handleAddReview = (newReviewData: {
		rating: number;
		comment: string;
		name: string;
		images: File[];
	}) => {
		const newEntry: ReviewItem = {
			id: Date.now().toString(),
			author: newReviewData.name,
			rating: newReviewData.rating,
			date: 'Just now',
			comment: newReviewData.comment,
			images: newReviewData.images.map(file => URL.createObjectURL(file)),
			likes: 0,
		};

		setReviews(prev => [newEntry, ...prev]);
	};

	return (
		<section className='mt-12 pt-10 border-surface-variant/40 border-t'>
			{/* Header & Overall Rating Breakdown */}
			<div className='flex sm:flex-row flex-col justify-between sm:items-center gap-6 mb-8'>
				<div>
					<h2 className='font-bold text-primary text-2xl'>
						Customer Reviews
					</h2>
					<div className='flex items-center gap-2 mt-1'>
						<div className='flex text-amber-400'>
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={18}
									className={
										i < 4
											? 'fill-amber-400'
											: 'text-gray-300'
									}
								/>
							))}
						</div>
						<span className='font-bold text-on-surface'>
							4.8 out of 5
						</span>
						<span className='text-on-surface-variant text-sm'>
							({reviews.length} reviews)
						</span>
					</div>
				</div>

				<button
					type='button'
					onClick={() => setIsModalOpen(true)}
					className='self-start sm:self-auto bg-surface-container-high hover:bg-surface-variant px-5 py-2.5 rounded-xl font-bold text-primary transition-all'
				>
					Write a Review
				</button>
			</div>

			{/* Review Cards List */}
			<div className='flex flex-col gap-6'>
				{reviews.map(review => (
					<div
						key={review.id}
						className='flex flex-col gap-3 bg-surface-container-low p-5 border border-surface-variant/30 rounded-2xl'
					>
						{/* Author & Rating Row */}
						<div className='flex justify-between items-center'>
							<div className='flex items-center gap-3'>
								<div className='flex justify-center items-center bg-primary-container rounded-full w-10 h-10 font-bold text-on-primary'>
									{review.author.charAt(0)}
								</div>
								<div>
									<p className='font-semibold text-on-surface leading-tight'>
										{review.author}
									</p>
									<span className='text-on-surface-variant text-xs'>
										{review.date}
									</span>
								</div>
							</div>

							<div className='flex text-amber-400'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={16}
										className={
											i < review.rating
												? 'fill-amber-400'
												: 'text-gray-300'
										}
									/>
								))}
							</div>
						</div>

						{/* Review Content */}
						<p className='text-on-surface-variant leading-relaxed'>
							{review.comment}
						</p>

						{/* Attached Images */}
						{review.images && review.images.length > 0 && (
							<div className='flex flex-wrap gap-2 mt-1'>
								{review.images.map((src, idx) => (
									<button
										key={idx}
										type='button'
										onClick={() => setActiveImage(src)}
										className='relative hover:opacity-90 border border-surface-variant rounded-xl w-20 h-20 overflow-hidden transition-opacity'
									>
										<Image
											src={src}
											alt={`Review photo ${idx + 1}`}
											fill
											className='object-cover'
										/>
									</button>
								))}
							</div>
						)}

						{/* Likes counter */}
						<div className='flex items-center gap-1.5 mt-1 text-on-surface-variant text-xs'>
							<button
								type='button'
								className='flex items-center gap-1 hover:text-primary transition-colors'
							>
								<ThumbsUp size={14} />
								<span>Helpful ({review.likes || 0})</span>
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Lightbox Modal for Previewing Attached Review Images */}
			{activeImage && (
				<div
					className='z-50 fixed inset-0 flex justify-center items-center bg-black/80 p-4'
					onClick={() => setActiveImage(null)}
				>
					<div className='relative w-full max-w-3xl h-full max-h-[80vh]'>
						<Image
							src={activeImage}
							alt='Full size review photo'
							fill
							className='object-contain'
						/>
					</div>
				</div>
			)}

			{/* Write Review Form Modal */}
			<AddReviewModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleAddReview}
			/>
		</section>
	);
}
