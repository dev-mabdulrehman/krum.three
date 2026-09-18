import CookieClient from '@/components/cookies/CookieClient';
import { db } from '@/config/firebase';
import { serializeData } from '@/lib/utils';
import { MenuItem, ProductRating, ReviewItem } from '@/types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CookiePageProps {
	params: Promise<{
		slug: string;
	}>;
}

async function getItemWithReviewsBySlug(
	slug: string,
): Promise<MenuItem | null> {
	try {
		const docRef = doc(db, 'menuItems', slug);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		const reviewsRef = collection(db, 'menuItems', slug, 'reviews');
		const reviewsSnap = await getDocs(reviewsRef);

		const reviews: ReviewItem[] = reviewsSnap.docs.map(reviewDoc => {
			const rawData = reviewDoc.data();
			return serializeData<ReviewItem>({
				id: reviewDoc.id,
				...rawData,
			});
		});

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

		const productRating: ProductRating = {
			averageRating,
			totalReviews,
			individualReviews: reviews,
		};

		return {
			id: docSnap.id,
			...docSnap.data(),
			productRating,
		} as MenuItem;
	} catch (error) {
		console.error('Error fetching cookie item and reviews:', error);
		return null;
	}
}

// Dynamic SEO Metadata Generation
export async function generateMetadata({
	params,
}: CookiePageProps): Promise<Metadata> {
	const { slug } = await params;
	const item = await getItemWithReviewsBySlug(slug);

	if (!item) {
		return {
			title: 'Item Not Found',
			description: 'The requested cookie could not be found.',
		};
	}

	const mainImage = item.imgs?.[0]?.src || '/default-cookie.jpg';

	return {
		title: `${item.name} | Fresh Cookies`,
		description: item.description,
		openGraph: {
			title: item.name,
			description: item.description,
			images: [
				{
					url: mainImage,
					width: 800,
					height: 800,
					alt: item.name,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: item.name,
			description: item.description,
			images: [mainImage],
		},
	};
}

export default async function CookiePage({ params }: CookiePageProps) {
	const { slug } = await params;
	const item = await getItemWithReviewsBySlug(slug);

	if (!item) {
		notFound();
	}

	return <CookieClient item={item} />;
}
