import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/home/HeroSection';
import SignaturesMenu from '@/components/home/SignaturesMenu';
import TopLiveNotificationBar from '@/components/home/TopLiveNotificationBar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
	return (
		<main className='flex flex-col min-h-screen'>
			<TopLiveNotificationBar />
			<HeroSection />
			<SignaturesMenu />
			{/* <BoxBuilder />
			<HeritageStory />
			<StudioSection /> */}
			<CartDrawer />

			<Footer />
		</main>
	);
}
