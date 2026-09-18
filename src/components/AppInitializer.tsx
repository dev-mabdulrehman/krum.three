import { Toaster } from 'react-hot-toast';
import { MenuItemsInitializer } from './MenuItemsInitializer';

export function AppInitializer({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Toaster />
			<MenuItemsInitializer />
			{/* <Analytics /> */}
			{/* <SpeedInsights /> */}
			{children}
		</>
	);
}
