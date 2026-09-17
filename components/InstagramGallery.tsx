'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import InstagramCard, { InstagramSkeleton } from './InstagramCard';

// Define Behold post media types
export type MediaTypes = 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';

export interface BeholdMediaSize {
	mediaUrl: string;
	width: number;
	height: number;
}

export interface BeholdPost {
	id: string;
	mediaType: MediaTypes;
	mediaUrl: string;
	permalink: string;
	prunedCaption?: string;
	caption?: string;
	timestamp?: string;
	sizes: {
		small: BeholdMediaSize;
		medium: BeholdMediaSize;
		large: BeholdMediaSize;
		full: BeholdMediaSize;
	};
}

export interface BeholdResponse {
	posts: BeholdPost[];
}

interface InstaGalleryProps {
	feedId: string;
	instagramProfileUrl?: string;
}

export default function InstagramGallery({
	feedId,
	instagramProfileUrl = 'https://instagram.com/krum.three',
}: InstaGalleryProps) {
	const [posts, setPosts] = useState<BeholdPost[]>([]);
	const [error, setError] = useState<string | null>(null);
	[];
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const controller = new AbortController();

		async function fetchFeed() {
			setLoading(true);
			try {
				const rawFeed = await fetch(
					`https://feeds.behold.so/${feedId}`,
					{
						signal: controller.signal,
					},
				);

				if (!rawFeed.ok) {
					const errorMessage = await rawFeed.text();
					throw new Error(errorMessage);
				}

				const feedJSON: BeholdResponse = await rawFeed.json();
				setPosts(feedJSON.posts || []);
			} catch (err: unknown) {
				if (err instanceof Error && err.name !== 'AbortError') {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}

		fetchFeed();

		return () => {
			controller.abort();
		};
	}, [feedId]);

	return (
		<section
			className='bg-surface-bright py-space-3xl lg:py-space-4xl w-full'
			id='signature-menu'
		>
			<div className='mx-auto px-margin-mobile lg:px-gutter-desktop max-w-max-content-width'>
				<div className='flex sm:flex-row flex-col justify-between items-start sm:items-end gap-space-md mb-8'>
					<div className='flex flex-col gap-space-2xs space-y-2 max-w-xl'>
						<div className='flex items-center gap-space-xs'>
							<span className='bg-secondary w-8 h-px'></span>
							<span className='font-label-sm font-bold text-label-sm text-secondary uppercase tracking-widest'>
								Social Presence
							</span>
						</div>
						<h2 className='font-headline-lg text-headline-lg text-primary'>
							Instagram Feed
						</h2>
						<p className='font-body-md text-body-md text-on-surface-variant'>
							Instagram is a great way to stay connected with our
							latest creations, behind-the-scenes moments, and
							special promotions. Follow us for a daily dose of
							cookie inspiration!
						</p>
					</div>

					{/* View All Button */}
					<a
						href={instagramProfileUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-primary/10 px-4 py-2.5 border border-surface-variant/40 hover:border-primary/50 rounded-full font-label-md font-poppins font-bold text-primary transition-all duration-300 shrink-0'
					>
						<span>View All</span>
						<ArrowUpRight size={18} />
					</a>
				</div>

				<div className='gap-space-lg grid grid-cols-2 sm:grid-cols-4'>
					{loading
						? new Array(4)
								.fill(null)
								.map((_, index) => (
									<InstagramSkeleton
										key={`InstagramSkeleton-${index}`}
									/>
								))
						: posts
								.slice(0, 4)
								.map(post => (
									<InstagramCard key={post.id} post={post} />
								))}
				</div>
			</div>
		</section>
	);
}
