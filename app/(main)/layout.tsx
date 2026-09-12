import '@/app/globals.css';
import Header from '@/components/layout/Header';
import TopNotificationBar from '@/components/layout/TopNotificationBar';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<TopNotificationBar />
			<Header />
			{children}
		</>
	);
}
