import { storage } from '@/config/firebase';
import { Timestamp } from 'firebase/firestore';
import {
	getDownloadURL,
	getMetadata,
	ref,
	uploadBytes,
} from 'firebase/storage';

export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function uploadImageIfFile(
	imageInput?: string | File,
	slug?: string,
): Promise<string> {
	if (!imageInput) return '';
	if (typeof imageInput === 'string') return imageInput;

	const fileName = imageInput.name;
	const storagePath = `menu/${slug !== undefined ? `${slug}/product/` : ''}${fileName}`;
	const storageRef = ref(storage, storagePath);
	try {
		await getMetadata(storageRef);
		throw new Error(
			`File '${fileName}' already exists in storage for this menu item.`,
		);
	} catch (error: any) {
		if (error.code !== 'storage/object-not-found') {
			throw error;
		}
	}

	const snapshot = await uploadBytes(storageRef, imageInput);
	return await getDownloadURL(snapshot.ref);
}

export function serializeData<T>(data: any): T {
	if (!data) return data;

	if (data instanceof Timestamp) {
		return data.toDate().toISOString() as any;
	}

	if (
		typeof data === 'object' &&
		typeof data.seconds === 'number' &&
		typeof data.nanoseconds === 'number'
	) {
		return new Date(data.seconds * 1000).toISOString() as any;
	}

	if (Array.isArray(data)) {
		return data.map(serializeData) as any;
	}

	if (typeof data === 'object') {
		const serialized: Record<string, any> = {};
		for (const key of Object.keys(data)) {
			serialized[key] = serializeData(data[key]);
		}
		return serialized as T;
	}

	return data;
}