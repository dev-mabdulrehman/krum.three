import { MenuFormData } from '@/components/admin/menu/AddMenuItemForm';
import { db, storage } from '@/config/firebase';
import { uploadImageIfFile } from '@/lib/utils';
import { Imgs, MenuItem, MixedImageData } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

export type NewMenuItem = Omit<MenuItem, 'id'>;

interface MenuState {
	items: Record<string, MenuItem>;
	bannerText: string;
	activeFilter: string;
	loading: boolean;
	error: null | string;
}

const initialState: MenuState = {
	bannerText:
		'Morning Bake Out of Oven: 14 Fresh Boxes Remaining in Gujrat Studio Today',
	activeFilter: 'all',
	items: {},
	loading: true,
	error: null,
};

export const fetchMenuItems = createAsyncThunk(
	'menu/fetchMenuItems',
	async (_, { rejectWithValue }) => {
		try {
			const querySnapshot = await getDocs(collection(db, 'menuItems'));
			const itemsMap: Record<string, MenuItem> = {};

			querySnapshot.forEach(docSnap => {
				itemsMap[docSnap.id] = {
					id: docSnap.id,
					...docSnap.data(),
				} as MenuItem;
			});
			return itemsMap;
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to fetch menu items');
		}
	},
);

export interface AddMenuItemPayload {
	data: MenuFormData;
	imagesData: MixedImageData[];
	coverIndex: number;
}

export const addMenuItem = createAsyncThunk(
	'menu/addMenuItem',
	async (payload: AddMenuItemPayload, { rejectWithValue }) => {
		try {
			const { imagesData, data, coverIndex } = payload;

			// 1. Check if document exists FIRST to prevent orphan uploads
			const docRef = doc(collection(db, 'menuItems'), data.slug);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				return rejectWithValue(
					`An item with slug '${data.slug}' already exists.`,
				);
			}

			let imgs: Imgs[] = [];

			// 2. Upload images
			if (imagesData && imagesData.length !== 0) {
				for (let index = 0; index < imagesData.length; index++) {
					const item = imagesData[index];
					let imgSrc = '';

					if (item.file) {
						imgSrc = await uploadImageIfFile(item.file, data.slug);
					} else if (item.previewUrl) {
						imgSrc = item.previewUrl;
					}

					imgs.push({
						src: imgSrc,
						alt: item.alt,
					});
				}

				// Move cover image to index 0
				if (coverIndex > 0 && coverIndex < imgs.length) {
					const cover = imgs.splice(coverIndex, 1)[0];
					imgs.unshift(cover);
				}
			}

			const firestoreDoc = {
				...data,
				imgs,
			};

			// 3. Create document
			await setDoc(docRef, firestoreDoc);

			return { id: docRef.id, ...firestoreDoc } as MenuItem;
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to add menu item');
		}
	},
);

export interface UpdateMenuItemPayload {
	id: string; // Existing item ID/slug
	data: Partial<NewMenuItem>;
	imagesData: MixedImageData[];
	coverIndex: number;
	oldImgs?: Imgs[];
}

export const updateMenuItem = createAsyncThunk(
	'menu/updateMenuItem',
	async (payload: UpdateMenuItemPayload, { rejectWithValue }) => {
		// Track newly uploaded URLs to perform cleanup if an error occurs mid-process
		const newlyUploadedSrcs: string[] = [];

		try {
			const {
				id: oldSlug,
				data,
				imagesData,
				coverIndex,
				oldImgs = [],
			} = payload;
			const newSlug = data.slug || oldSlug;
			const isSlugChanged = newSlug !== oldSlug;

			// 1. Check if new slug conflicts with an existing item
			if (isSlugChanged) {
				const newDocRef = doc(db, 'menuItems', newSlug);
				const newDocSnap = await getDoc(newDocRef);
				if (newDocSnap.exists()) {
					return rejectWithValue(
						`An item with slug '${newSlug}' already exists.`,
					);
				}
			}

			// 2. Process image array (upload new files, retain existing URLs)
			const processedImages: Imgs[] = [];

			for (let index = 0; index < imagesData.length; index++) {
				const item = imagesData[index];
				let imgSrc = '';

				if (item.isExisting) {
					imgSrc = item.previewUrl;
				} else if (item.file) {
					// This will throw if the file already exists in Firebase Storage
					imgSrc = await uploadImageIfFile(item.file, newSlug);
					newlyUploadedSrcs.push(imgSrc);
				}

				if (imgSrc) {
					processedImages.push({
						src: imgSrc,
						alt: item.alt || '',
					});
				}
			}

			// 3. Rearrange cover image to index 0
			if (coverIndex > 0 && coverIndex < processedImages.length) {
				const cover = processedImages.splice(coverIndex, 1)[0];
				processedImages.unshift(cover);
			}

			// 4. Delete removed images from Storage
			const remainingSrcs = new Set(processedImages.map(img => img.src));
			const removedImgs = oldImgs.filter(
				img => !remainingSrcs.has(img.src),
			);

			for (const img of removedImgs) {
				if (img.src && img.src.includes('firebasestorage')) {
					try {
						const storageRef = ref(storage, img.src);
						await deleteObject(storageRef);
					} catch (imageErr: any) {
						console.warn(
							'Could not delete removed image from storage:',
							imageErr.message,
						);
					}
				}
			}

			const updatedDocData = {
				...data,
				imgs: processedImages,
			};

			// 5. Update or migrate document in Firestore
			if (isSlugChanged) {
				const newDocRef = doc(db, 'menuItems', newSlug);
				await setDoc(newDocRef, { ...updatedDocData, slug: newSlug });

				const oldDocRef = doc(db, 'menuItems', oldSlug);
				await deleteDoc(oldDocRef);

				return {
					id: newSlug,
					oldId: oldSlug,
					...updatedDocData,
				};
			} else {
				const docRef = doc(db, 'menuItems', oldSlug);
				await updateDoc(docRef, updatedDocData);

				return {
					id: oldSlug,
					...updatedDocData,
				};
			}
		} catch (err: any) {
			// Roll back any files that were successfully uploaded before the error occurred
			for (const src of newlyUploadedSrcs) {
				try {
					const storageRef = ref(storage, src);
					await deleteObject(storageRef);
				} catch (cleanupErr) {
					console.warn(
						'Failed to clean up uploaded file after error:',
						cleanupErr,
					);
				}
			}

			return rejectWithValue(err.message || 'Failed to update menu item');
		}
	},
);

export const deleteMenuItem = createAsyncThunk(
	'menu/deleteMenuItem',
	async (item: { id: string; imgs: Imgs[] }, { rejectWithValue }) => {
		try {
			for (let index = 0; index < item.imgs.length; index++) {
				try {
					const storageRef = ref(storage, item.imgs[index].src);
					await deleteObject(storageRef);
				} catch (imageErr: any) {
					console.warn(
						'Could not delete image from storage:',
						imageErr.message,
					);
				}
			}
			await deleteDoc(doc(db, 'menuItems', item.id));

			return item.id;
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to delete menu item');
		}
	},
);

const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		setFilter(state, action: PayloadAction<string>) {
			state.activeFilter = action.payload;
		},
		setMenuItems(state, action: PayloadAction<Record<string, MenuItem>>) {
			state.items = action.payload;
		},
		updateBannerText(state, action: PayloadAction<string>) {
			state.bannerText = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchMenuItems.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMenuItems.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchMenuItems.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(addMenuItem.fulfilled, (state, action) => {
				state.items[action.payload.id] = action.payload;
			})
			.addCase(updateMenuItem.fulfilled, (state, action) => {
				const { id, oldId, ...updated } = action.payload as MenuItem & {
					oldId?: string;
				};

				if (oldId && oldId !== id) {
					delete state.items[oldId];
				}

				state.items[id] = {
					...state.items[id],
					...updated,
					id,
				} as MenuItem;
			})
			.addCase(deleteMenuItem.fulfilled, (state, action) => {
				delete state.items[action.payload];
			});
	},
});

export const { setFilter, updateBannerText } = menuSlice.actions;
export default menuSlice.reducer;
