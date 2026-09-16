'use client';

import { ImagePlus, Star, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';

interface AddReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reviewData: {
		rating: number;
		comment: string;
		name: string;
		images: File[];
	}) => void;
}

export default function AddReviewModal({
	isOpen,
	onClose,
	onSubmit,
}: AddReviewModalProps) {
	const [rating, setRating] = useState<number>(5);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [comment, setComment] = useState<string>('');
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	if (!isOpen) return null;

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const files = Array.from(e.target.files);
		const newImages = [...images, ...files].slice(0, 4); // Max 4 images
		setImages(newImages);

		// Generate object URLs for immediate preview
		const newPreviews = newImages.map(file => URL.createObjectURL(file));
		setImagePreviews(newPreviews);
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

		// Revoke memory for removed preview URL
		URL.revokeObjectURL(imagePreviews[index]);

		setImages(updatedImages);
		setImagePreviews(updatedPreviews);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!comment.trim() || !name.trim()) return;

		onSubmit({ rating, comment, name, images });

		// Reset state & close
		setName('');
		setComment('');
		setRating(5);
		setImages([]);
		setImagePreviews([]);
		onClose();
	};

	return (
		<div className='z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4'>
			<div className='relative bg-surface-container-lowest shadow-2xl p-6 border border-surface-variant/40 rounded-2xl w-full max-w-lg'>
				{/* Header */}
				<div className='flex justify-between items-center pb-4 border-surface-variant/40 border-b'>
					<h3 className='font-bold text-primary text-xl'>
						Write a Review
					</h3>
					<button
						type='button'
						onClick={onClose}
						className='hover:bg-surface-variant p-1 rounded-full text-on-surface-variant transition-colors'
					>
						<X size={20} />
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4 mt-4'
				>
					{/* Star Rating Select */}
					<div>
						<label className='block mb-1 font-semibold text-on-surface-variant text-xs uppercase tracking-wider'>
							Your Rating
						</label>
						<div className='flex items-center gap-1'>
							{[1, 2, 3, 4, 5].map(star => (
								<button
									key={star}
									type='button'
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									className='p-1 focus:outline-none text-amber-400'
								>
									<Star
										size={26}
										className={
											(hoverRating || rating) >= star
												? 'fill-amber-400'
												: 'text-gray-300'
										}
									/>
								</button>
							))}
						</div>
					</div>

					{/* Name Input */}
					<div>
						<label className='block mb-1 font-semibold text-on-surface-variant text-xs uppercase tracking-wider'>
							Your Name
						</label>
						<input
							type='text'
							required
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='e.g., Sarah M.'
							className='bg-surface-container-low px-4 py-2.5 border border-surface-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 w-full text-on-surface'
						/>
					</div>

					{/* Review Text Area */}
					<div>
						<label className='block mb-1 font-semibold text-on-surface-variant text-xs uppercase tracking-wider'>
							Review
						</label>
						<textarea
							rows={3}
							required
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder='What did you like or dislike about this product?'
							className='bg-surface-container-low px-4 py-2.5 border border-surface-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 w-full text-on-surface'
						/>
					</div>

					{/* Image Upload Area */}
					<div>
						<label className='block mb-1 font-semibold text-on-surface-variant text-xs uppercase tracking-wider'>
							Add Photos (Up to 4)
						</label>
						<div className='flex flex-wrap items-center gap-3 mt-1'>
							{imagePreviews.map((src, index) => (
								<div
									key={index}
									className='relative border border-surface-variant rounded-xl w-16 h-16 overflow-hidden'
								>
									<Image
										src={src}
										alt='Review preview'
										fill
										className='object-cover'
									/>
									<button
										type='button'
										onClick={() => handleRemoveImage(index)}
										className='top-1 right-1 absolute bg-black/60 hover:bg-black p-0.5 rounded-full text-white'
									>
										<X size={12} />
									</button>
								</div>
							))}

							{imagePreviews.length < 4 && (
								<label className='flex flex-col justify-center items-center border-2 border-surface-variant hover:border-primary border-dashed rounded-xl w-16 h-16 text-on-surface-variant transition-colors cursor-pointer'>
									<ImagePlus size={20} />
									<input
										type='file'
										accept='image/*'
										multiple
										onChange={handleImageChange}
										className='hidden'
									/>
								</label>
							)}
						</div>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='bg-primary hover:bg-primary-container mt-2 py-3 rounded-xl font-bold text-on-primary transition-colors'
					>
						Submit Review
					</button>
				</form>
			</div>
		</div>
	);
}
