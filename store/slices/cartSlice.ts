import { BoxSlot, CartItem } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
	isOpen: boolean;
	items: CartItem[];
	deliveryType: 'dispatch' | 'pickup';
	deliveryFee: number;
	boxSlots: (BoxSlot | null)[];
}

const initialState: CartState = {
	isOpen: false,
	items: [],
	deliveryType: 'dispatch',
	deliveryFee: 150,
	boxSlots: [null, null, null, null],
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
		},
		setDeliveryType(state, action: PayloadAction<'dispatch' | 'pickup'>) {
			state.deliveryType = action.payload;
			state.deliveryFee = action.payload === 'dispatch' ? 150 : 0;
		},
		addSlotToBox(state, action: PayloadAction<BoxSlot>) {
			const emptyIdx = state.boxSlots.findIndex(slot => slot === null);
			if (emptyIdx !== -1) {
				state.boxSlots[emptyIdx] = action.payload;
			}
		},
		clearBoxSlot(state, action: PayloadAction<number>) {
			state.boxSlots[action.payload] = null;
		},
		resetBoxSlots(state) {
			state.boxSlots = [null, null, null, null];
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
