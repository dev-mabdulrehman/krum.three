'use client';

import { useEffect, useState } from 'react';
import InstagramCard from './InstagramCard';

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
}

export default function InstaGallery({ feedId }: InstaGalleryProps) {
	const [posts, setPosts] = useState<BeholdPost[]>([]);

	useEffect(() => {
		const controller = new AbortController();

		async function fetchFeed() {
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
					console.error('Error fetching feed:', err.message);
				}
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
				<div className='flex flex-col gap-space-2xs space-y-2 mb- mb-8 max-w-xl'>
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
						latest creations, behind-the-scenes moments, and special
						promotions. Follow us for a daily dose of cookie
						inspiration!
					</p>
				</div>

				<div className='gap-space-lg grid grid-cols-2 sm:grid-cols-4'>
					{posts.slice(0, 4).map(post => (
						<InstagramCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}
