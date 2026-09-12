import { db, storage } from '@/config/firebase';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
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
	loading: false,
	error: null,
};

// Helper function to handle image uploads
async function uploadImageIfFile(imageInput?: string | File): Promise<string> {
	if (!imageInput) return '';
	if (typeof imageInput === 'string') return imageInput;

	const storageRef = ref(
		storage,
		`menu-images/${Date.now()}_${imageInput.name}`,
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
			let imgSrc = data.imgSrc || '';

			if (imageFile) {
				imgSrc = await uploadImageIfFile(imageFile);
			}

			const docRef = await addDoc(collection(db, 'menuItems'), {
				...data,
				imgSrc,
			});

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
			id: string;
			data: Partial<NewMenuItem>;
			imageFile?: File;
			oldImgSrc?: string; //  Pass the previous image URL here
		},
		{ rejectWithValue },
	) => {
		try {
			const { id, data, imageFile, oldImgSrc } = payload;
			let imgSrc = data.imgSrc || '';

			if (imageFile) {
				// 1. Upload the new image first
				imgSrc = await uploadImageIfFile(imageFile);

				// 2. Delete the old image from storage if it exists
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
			const docRef = doc(db, 'menuItems', id);
			await updateDoc(docRef, updatedData);

			return { id, ...updatedData };
		} catch (err: any) {
			return rejectWithValue(err.message || 'Failed to update menu item');
		}
	},
);

export const deleteMenuItem = createAsyncThunk(
	'menu/deleteMenuItem',
	async (item: { id: string; imgSrc?: string }, { rejectWithValue }) => {
		try {
			// 1. Delete the image from Firebase Storage if it exists and is a Firebase URL
			if (item.imgSrc && item.imgSrc.includes('firebasestorage')) {
				try {
					const storageRef = ref(storage, item.imgSrc);
					await deleteObject(storageRef);
				} catch (imageErr: any) {
					// Log or handle image deletion errors (e.g., if image was already missing)
					console.warn(
						'Could not delete image from storage:',
						imageErr.message,
					);
				}
			}

			// 2. Delete the document from Firestore
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
				const updated = action.payload;
				if (state.items[updated.id]) {
					state.items[updated.id] = {
						...state.items[updated.id],
						...updated,
					};
				}
			})
			.addCase(deleteMenuItem.fulfilled, (state, action) => {
				delete state.items[action.payload];
			});
	},
});

export const { setFilter, updateBannerText } = menuSlice.actions;
export default menuSlice.reducer;
