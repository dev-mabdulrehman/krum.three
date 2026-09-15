import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/home/HeroSection';
import SignaturesMenu from '@/components/home/SignaturesMenu';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
	return (
		<main className='flex flex-col min-h-screen'>
			<HeroSection />
			<SignaturesMenu />
			<CartDrawer />

			<Footer />
		</main>
	);
}
