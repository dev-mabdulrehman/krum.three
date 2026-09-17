import '@/app/globals.css';
import CartDrawer from '@/components/CartDrawer';
import Header from '@/components/layout/Header';
import TopNotificationBar from '@/components/layout/TopNotificationBar';
import ScrollToTop from '@/components/ScrollToTop';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<ScrollToTop />
			<div className='top-0 z-30 sticky'>
				<TopNotificationBar />
				<Header />
			</div>
			<main>{children}</main>
			<CartDrawer />
		</>
	);
}
