'use client';

import { ImagePlus, Star, User, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast'; // Adjust toast import path if using a custom wrapper
import Input from '../admin/Input';

interface AddReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reviewData: {
		rating: number;
		comment: string;
		name: string;
		images: File[];
	}) => Promise<void> | void;
	isSubmitting?: boolean;
}

export default function AddReviewModal({
	isOpen,
	onClose,
	onSubmit,
	isSubmitting = false,
}: AddReviewModalProps) {
	const [rating, setRating] = useState<number>(5);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [comment, setComment] = useState<string>('');
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	if (!isOpen) return null;

	const resetForm = () => {
		// Revoke preview object URLs to prevent memory leaks
		imagePreviews.forEach(url => URL.revokeObjectURL(url));

		setName('');
		setComment('');
		setRating(5);
		setImages([]);
		setImagePreviews([]);
	};

	const handleClose = () => {
		if (isSubmitting) return;
		resetForm();
		onClose();
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const files = Array.from(e.target.files);
		const newImages = [...images, ...files].slice(0, 4);
		setImages(newImages);

		const newPreviews = newImages.map(file => URL.createObjectURL(file));
		setImagePreviews(newPreviews);
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

		URL.revokeObjectURL(imagePreviews[index]);

		setImages(updatedImages);
		setImagePreviews(updatedPreviews);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error('Please enter your name');
			return;
		}

		if (!comment.trim()) {
			toast.error('Please write a review comment');
			return;
		}

		if (isSubmitting) return;

		try {
			await onSubmit({ rating, comment, name, images });
			toast.success('Review submitted successfully!');
			resetForm();
		} catch (error) {
			console.error('Failed to submit review:', error);
			toast.error('Failed to submit review. Please try again.');
		}
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
						onClick={handleClose}
						className='hover:bg-surface-variant disabled:opacity-50 p-1 rounded-full text-on-surface-variant transition-colors'
						disabled={isSubmitting}
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
							Your Rating <span className='text-red-500'>*</span>
						</label>
						<div className='flex items-center gap-1'>
							{[1, 2, 3, 4, 5].map(star => (
								<button
									key={star}
									type='button'
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									className='disabled:opacity-50 p-1 focus:outline-none text-amber-400'
									disabled={isSubmitting}
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

					{/* Custom Input for Name */}
					<Input
						label='Your Name'
						name='name'
						type='text'
						required
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder='e.g., Sarah M.'
						icon={<User size={18} />}
						disabled={isSubmitting}
					/>

					{/* Review Text Area */}
					<div>
						<label
							htmlFor='comment'
							className='block mb-1 font-semibold text-on-surface-variant text-xs uppercase tracking-wider'
						>
							Review <span className='text-red-500'>*</span>
						</label>
						<textarea
							id='comment'
							rows={3}
							required
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder='What did you like or dislike about this product?'
							disabled={isSubmitting}
							className='bg-surface-container-low disabled:opacity-50 px-4 py-2.5 border border-black/10 focus:border-black/40 rounded-xl outline-none w-full text-on-surface text-sm transition-colors'
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
										disabled={isSubmitting}
										className='top-1 right-1 absolute bg-black/60 hover:bg-black disabled:opacity-50 p-0.5 rounded-full text-white'
									>
										<X size={12} />
									</button>
								</div>
							))}

							{imagePreviews.length < 4 && (
								<label
									className={`flex flex-col justify-center items-center border-2 border-surface-variant hover:border-primary border-dashed rounded-xl w-16 h-16 text-on-surface-variant transition-colors ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
								>
									<ImagePlus size={20} />
									<input
										type='file'
										accept='image/*'
										multiple
										onChange={handleImageChange}
										disabled={isSubmitting}
										className='hidden'
									/>
								</label>
							)}
						</div>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						disabled={isSubmitting}
						className='bg-primary hover:bg-primary-container disabled:opacity-50 mt-2 py-3 rounded-xl font-bold text-on-primary transition-colors'
					>
						{isSubmitting ? 'Submitting...' : 'Submit Review'}
					</button>
				</form>
			</div>
		</div>
	);
}
