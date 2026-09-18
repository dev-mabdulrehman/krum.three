'use client';

import { Play, X } from 'lucide-react';
import { useState } from 'react';
import { BeholdPost } from './InstagramGallery';

interface InstagramCardProps {
	post: BeholdPost;
}

export default function InstagramCard({ post }: InstagramCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isVideo = post.mediaType === 'VIDEO';
	const posterUrl = post.sizes?.medium?.mediaUrl || post.mediaUrl;
	const fullImageUrl =
		post.sizes?.large?.mediaUrl ||
		post.sizes?.full?.mediaUrl ||
		post.mediaUrl;
	const captionText = post.prunedCaption || post.caption || 'Instagram post';

	// Capture a video frame from 1.5 seconds in to avoid a black starting frame
	const videoSource = isVideo ? `${post.mediaUrl}#t=1.5` : '';

	const handleCardClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsModalOpen(true);
	};

	return (
		<>
			<a
				href={post.permalink}
				onClick={handleCardClick}
				className='group relative flex flex-col bg-surface-container-low p-2 border border-surface-variant/30 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer'
			>
				{/* 4:5 Aspect Ratio Container */}
				<div className='relative bg-surface-container rounded-lg w-full aspect-4/5 overflow-hidden'>
					{isVideo ? (
						<>
							<video
								poster={posterUrl}
								src={videoSource}
								muted
								playsInline
								className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
							/>

							{/* Play Overlay Badge */}
							<div className='absolute inset-0 flex justify-center items-center bg-black/20 group-hover:bg-black/30 transition-colors'>
								<div className='flex justify-center items-center bg-black/60 backdrop-blur-sm rounded-full w-10 h-10 text-white group-hover:scale-110 transition-transform'>
									<Play
										size={20}
										className='fill-white ml-0.5'
									/>
								</div>
							</div>
						</>
					) : (
						<img
							src={posterUrl}
							alt={captionText}
							className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
						/>
					)}
				</div>

				{post.prunedCaption && (
					<figcaption className='mt-2 px-1 text-on-surface-variant text-xs line-clamp-2'>
						{post.prunedCaption}
					</figcaption>
				)}
			</a>

			{/* Modal Lightbox (Image & Video) */}
			{isModalOpen && (
				<div
					className='z-50 fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4'
					onClick={() => setIsModalOpen(false)}
				>
					<div
						className='relative bg-black shadow-2xl border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden'
						onClick={e => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							type='button'
							onClick={() => setIsModalOpen(false)}
							className='top-3 right-3 z-10 absolute bg-black/60 hover:bg-black p-1.5 rounded-full text-white transition-colors'
						>
							<X size={20} />
						</button>

						{/* Modal Media Display (4:5 Aspect Ratio) */}
						<div className='relative bg-black w-full aspect-4/5'>
							{isVideo ? (
								<video
									src={post.mediaUrl}
									controls
									autoPlay
									playsInline
									className='w-full h-full object-cover'
								/>
							) : (
								<img
									src={fullImageUrl}
									alt={captionText}
									className='w-full h-full object-cover'
								/>
							)}
						</div>

						{/* Modal Footer */}
						<div className='flex flex-col gap-2 bg-surface-container-lowest p-4'>
							{captionText && (
								<p className='text-on-surface text-xs line-clamp-3'>
									{captionText}
								</p>
							)}
							<a
								href={post.permalink}
								target='_blank'
								rel='noopener noreferrer'
								className='self-start mt-1 font-bold text-primary text-xs hover:underline'
							>
								View on Instagram →
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export function InstagramSkeleton() {
	return (
		<div className='flex flex-col bg-surface-container-low p-2 border border-surface-variant/30 rounded-xl overflow-hidden animate-pulse'>
			{/* 4:5 Media Aspect Ratio Placeholder */}
			<div className='bg-surface-variant/40 rounded-lg w-full aspect-4/5' />

			{/* Caption Text Placeholders */}
			<div className='space-y-1.5 mt-3 px-1'>
				<div className='bg-surface-variant/40 rounded-sm w-full h-3' />
				<div className='bg-surface-variant/40 rounded-sm w-2/3 h-3' />
			</div>
		</div>
	);
}