import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
	reducer: {
		menu: menuReducer,
		cart: cartReducer,
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
