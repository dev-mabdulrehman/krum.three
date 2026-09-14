// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
	isAuthenticated: boolean;
	user: any | null;
	token: string | null;
	isLoading: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	token: null,
	isLoading: false,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: any; token: string }>,
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
		},
		logout: state => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
