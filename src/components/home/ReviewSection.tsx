'use client';

import { db, storage } from '@/config/firebase';
import { ProductRating, ReviewItem } from '@/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import AddReviewModal from './AddReviewModal';

interface ReviewsSectionProps {
	slug: string;
	productRating?: ProductRating;
}

export default function ReviewsSection({
	slug,
	productRating,
}: ReviewsSectionProps) {
	const [reviews, setReviews] = useState<ReviewItem[]>(
		productRating?.individualReviews || [],
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [activeImage, setActiveImage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [orderId] = useState<string>(() => {
		// Generate a unique order ID for this session
		return `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
	});

	// Calculate dynamic rating averages based on current state
	const totalReviews = reviews.length;
	const averageRating =
		totalReviews > 0
			? Number(
					(
						reviews.reduce(
							(acc, curr) => acc + (curr.rating || 5),
							0,
						) / totalReviews
					).toFixed(1),
				)
			: 0;

	const handleAddReview = async (newReviewData: {
		rating: number;
		comment: string;
		name: string;
		images: File[];
	}) => {
		setIsSubmitting(true);
		try {
			// 1. Upload attached photos to Firebase Storage
			const uploadedImageUrls: string[] = [];

			for (const file of newReviewData.images) {
				const storageRef = ref(
					storage,
					`/menu/${slug}/reviews/${orderId}/${file.name}`,
				);
				const snapshot = await uploadBytes(storageRef, file);
				const downloadUrl = await getDownloadURL(snapshot.ref);
				uploadedImageUrls.push(downloadUrl);
			}

			// 2. Reference the Firestore Subcollection: /menuItems/{slug}/reviews
			const reviewsRef = collection(db, 'menuItems', slug, 'reviews');

			const newReviewPayload = {
				author: newReviewData.name,
				rating: newReviewData.rating,
				comment: newReviewData.comment,
				images: uploadedImageUrls,
				likes: 0,
				createdAt: serverTimestamp(),
			};

			// 3. Save new review document in Firestore
			const docRef = await addDoc(reviewsRef, newReviewPayload);

			// 4. Update local state immediately for instant UI response
			const newEntry: ReviewItem = {
				id: docRef.id,
				author: newReviewData.name,
				rating: newReviewData.rating,
				date: new Date().toLocaleDateString(),
				comment: newReviewData.comment,
				images: uploadedImageUrls,
			};

			setReviews(prev => [newEntry, ...prev]);
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error submitting review to Firebase:', error);
		} finally {
			setIsSubmitting(false);
		}
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
										i < Math.round(averageRating)
											? 'fill-amber-400 text-amber-400'
											: 'text-gray-300'
									}
								/>
							))}
						</div>
						<span className='font-bold text-on-surface'>
							{averageRating > 0
								? `${averageRating} out of 5`
								: 'No reviews yet'}
						</span>
						<span className='text-on-surface-variant text-sm'>
							({totalReviews}{' '}
							{totalReviews === 1 ? 'review' : 'reviews'})
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
			{reviews.length === 0 ? (
				<div className='py-8 text-on-surface-variant text-center'>
					Be the first to leave a review for this item!
				</div>
			) : (
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
										{review.author
											? review.author
													.charAt(0)
													.toUpperCase()
											: 'U'}
									</div>
									<div>
										<p className='font-semibold text-on-surface leading-tight'>
											{review.author || 'Anonymous'}
										</p>
										<span className='text-on-surface-variant text-xs'>
											{review.date || 'Recently'}
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
													? 'fill-amber-400 text-amber-400'
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
						</div>
					))}
				</div>
			)}

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
				isSubmitting={isSubmitting}
			/>
		</section>
	);
}
