import { db, storage } from '@/config/firebase';
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
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';

export interface MenuItem {
	id: string;
	name: string;
	price: number;
	badge?: string;
	weight: string;
	stockStatus: string;
	description: string;
	imgSrc?: string;
	imgAlt?: string;
	slug: string;
}

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

// Helper function to handle image uploads
async function uploadImageIfFile(
	imageInput?: string | File,
	slug?: string,
): Promise<string> {
	if (!imageInput) return '';
	if (typeof imageInput === 'string') return imageInput;

	const storageRef = ref(
		storage,
		`menu-images/${Date.now()}_${slug?.replace(/ /g, '_').toLowerCase()}`,
	);
	const snapshot = await uploadBytes(storageRef, imageInput);
	return await getDownloadURL(snapshot.ref);
}

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

export const addMenuItem = createAsyncThunk(
	'menu/addMenuItem',
	async (
		payload: NewMenuItem & { imageFile?: File },
		{ rejectWithValue },
	) => {
		try {
			const { imageFile, ...data } = payload;

			// 1. Check if document exists FIRST to prevent orphan uploads
			const docRef = doc(collection(db, 'menuItems'), data.slug);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				return rejectWithValue(
					`An item with slug '${data.slug}' already exists.`,
				);
			}

			// 2. Upload image only if document check passes
			let imgSrc = data.imgSrc || '';
			if (imageFile) {
				imgSrc = await uploadImageIfFile(imageFile, data.slug);
			}

			// 3. Create document
			await setDoc(docRef, { ...data, imgSrc });

			return { id: docRef.id, ...data, imgSrc } as MenuItem;
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to add menu item');
		}
	},
);

export const updateMenuItem = createAsyncThunk(
	'menu/updateMenuItem',
	async (
		payload: {
			id: string; // Current document ID / slug in Firestore
			data: Partial<NewMenuItem>;
			imageFile?: File;
			oldImgSrc?: string;
		},
		{ rejectWithValue },
	) => {
		try {
			const { id: oldSlug, data, imageFile, oldImgSrc } = payload;

			const newSlug = data.slug || oldSlug;
			const isSlugChanged = newSlug !== oldSlug;

			// 1. If slug changed, verify target document ID doesn't already exist
			if (isSlugChanged) {
				const newDocRef = doc(db, 'menuItems', newSlug);
				const newDocSnap = await getDoc(newDocRef);
				if (newDocSnap.exists()) {
					return rejectWithValue(
						`An item with slug '${newSlug}' already exists.`,
					);
				}
			}

			// 2. Upload new image if provided and cleanup old image
			let imgSrc = data.imgSrc || '';
			if (imageFile) {
				imgSrc = await uploadImageIfFile(imageFile, newSlug);

				if (oldImgSrc && oldImgSrc.includes('firebasestorage')) {
					try {
						const oldStorageRef = ref(storage, oldImgSrc);
						await deleteObject(oldStorageRef);
					} catch (imageErr: any) {
						console.warn(
							'Could not delete old image from storage:',
							imageErr.message,
						);
					}
				}
			}

			const updatedData = { ...data, ...(imgSrc ? { imgSrc } : {}) };

			// 3. Update or Move Document in Firestore
			if (isSlugChanged) {
				// Create new document with new slug ID
				const newDocRef = doc(db, 'menuItems', newSlug);
				await setDoc(newDocRef, { ...updatedData, slug: newSlug });

				// Delete old document with old slug ID
				const oldDocRef = doc(db, 'menuItems', oldSlug);
				await deleteDoc(oldDocRef);

				return {
					id: newSlug,
					oldId: oldSlug,
					...updatedData,
				};
			} else {
				// Standard update if slug did not change
				const docRef = doc(db, 'menuItems', oldSlug);
				await updateDoc(docRef, updatedData);

				return { id: oldSlug, ...updatedData };
			}
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to update menu item');
		}
	},
);

export const deleteMenuItem = createAsyncThunk(
	'menu/deleteMenuItem',
	async (item: { id: string; imgSrc?: string }, { rejectWithValue }) => {
		try {
			if (item.imgSrc && item.imgSrc.includes('firebasestorage')) {
				try {
					const storageRef = ref(storage, item.imgSrc);
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

				// Clean up previous key from Redux state if slug was updated
				if (oldId && oldId !== id) {
					delete state.items[oldId];
				}

				state.items[id] = {
					...state.items[id],
					...updated,
					id,
				};
			})
			.addCase(deleteMenuItem.fulfilled, (state, action) => {
				delete state.items[action.payload];
			});
	},
});

export const { setFilter, updateBannerText } = menuSlice.actions;
export default menuSlice.reducer;
