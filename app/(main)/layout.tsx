import '@/app/globals.css';
import CartDrawer from '@/components/CartDrawer';
import Header from '@/components/layout/Header';
import TopNotificationBar from '@/components/layout/TopNotificationBar';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className='top-0 z-30 sticky'>
				<TopNotificationBar />
				<Header />
				<CartDrawer />
			</div>
			{children}
		</>
	);
}
