import { storage } from '@/config/firebase';
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

	// Check if the file already exists in Firebase Storage
	try {
		await getMetadata(storageRef);
		// If getMetadata succeeds, the file exists
		throw new Error(
			`File '${fileName}' already exists in storage for this menu item.`,
		);
	} catch (error: any) {
		// If the error code is 'storage/object-not-found', the file doesn't exist and we can proceed
		if (error.code !== 'storage/object-not-found') {
			throw error; // Re-throw duplicate file error or network/auth errors
		}
	}

	const snapshot = await uploadBytes(storageRef, imageInput);
	return await getDownloadURL(snapshot.ref);
}
