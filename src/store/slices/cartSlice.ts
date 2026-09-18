import { BoxSlot, CartItem } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
	isOpen: boolean;
	items: CartItem[];
	deliveryType: 'dispatch' | 'pickup';
	deliveryFee: number;
	boxSlots: (BoxSlot | null)[];
}

const LOCAL_STORAGE_KEY = 'shopping_cart_state';

// Helper to safely load state from localStorage (SSR safe)
const loadSavedState = (): Partial<CartState> | null => {
	if (typeof window === 'undefined') return null;
	try {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		return saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
};

// Helper to save state to localStorage
const saveState = (state: CartState) => {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify({
				items: state.items,
				deliveryType: state.deliveryType,
				deliveryFee: state.deliveryFee,
				boxSlots: state.boxSlots,
			}),
		);
	} catch (e) {
		console.error('Failed to save cart state to localStorage', e);
	}
};

const savedState = loadSavedState();

const initialState: CartState = {
	isOpen: false,
	items: savedState?.items || [],
	deliveryType: savedState?.deliveryType || 'dispatch',
	deliveryFee: savedState?.deliveryFee ?? 150,
	boxSlots: savedState?.boxSlots || [null, null, null, null],
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		toggleCart(state, action: PayloadAction<boolean | undefined>) {
			state.isOpen =
				action.payload !== undefined ? action.payload : !state.isOpen;
		},
		addToCart(
			state,
			action: PayloadAction<{
				id: string;
				name: string;
				price: number;
				img: string;
				qty: number;
				isBox?: boolean;
			}>,
		) {
			const { id, name, price, img, qty, isBox } = action.payload;
			const existing = state.items.find(
				item => item.id === id && !item.isBox,
			);
			if (existing && !isBox) {
				existing.qty += qty;
			} else {
				state.items.push({
					cartId: `${id}-${Date.now()}`,
					id,
					name,
					price,
					img,
					qty,
					isBox: !!isBox,
				});
			}
			state.isOpen = true;
			saveState(state);
		},
		updateQty(
			state,
			action: PayloadAction<{ cartId: string; delta: number }>,
		) {
			const item = state.items.find(
				i => i.cartId === action.payload.cartId,
			);
			if (item) {
				item.qty += action.payload.delta;
				if (item.qty <= 0) {
					state.items = state.items.filter(
						i => i.cartId !== action.payload.cartId,
					);
				}
			}
			saveState(state);
		},
		setDeliveryType(state, action: PayloadAction<'dispatch' | 'pickup'>) {
			state.deliveryType = action.payload;
			state.deliveryFee = action.payload === 'dispatch' ? 150 : 0;
			saveState(state);
		},
		addSlotToBox(state, action: PayloadAction<BoxSlot>) {
			const emptyIdx = state.boxSlots.findIndex(slot => slot === null);
			if (emptyIdx !== -1) {
				state.boxSlots[emptyIdx] = action.payload;
			}
			saveState(state);
		},
		clearBoxSlot(state, action: PayloadAction<number>) {
			state.boxSlots[action.payload] = null;
			saveState(state);
		},
		resetBoxSlots(state) {
			state.boxSlots = [null, null, null, null];
			saveState(state);
		},
	},
});

export const {
	toggleCart,
	addToCart,
	updateQty,
	setDeliveryType,
	addSlotToBox,
	clearBoxSlot,
	resetBoxSlots,
} = cartSlice.actions;

export default cartSlice.reducer;
