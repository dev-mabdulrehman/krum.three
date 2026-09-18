'use client';

import { useFirestoreSubscription } from '@/hooks/useFirestoreSubscription';
import { useAppDispatch } from '@/store/hooks';
import { setMenuItems } from '@/store/slices/menuSlice';
import { MenuItem } from '@/types';
import { useEffect } from 'react';

export function MenuItemsInitializer() {
	const dispatch = useAppDispatch();
	const { data: menuItemsData } =
		useFirestoreSubscription<MenuItem>('menuItems');

	useEffect(() => {
		if (menuItemsData && Object.keys(menuItemsData).length > 0) {
			dispatch(setMenuItems(menuItemsData));
		}
	}, [menuItemsData, dispatch]);

	return null; 
}
