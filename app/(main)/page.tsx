import HeroSection from '@/components/home/HeroSection';
import { OrderProcessSection } from '@/components/home/OrderProcessSection';
import SignaturesMenu from '@/components/home/SignaturesMenu';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
	return (
		<main className='flex flex-col min-h-screen'>
			<HeroSection />
			<SignaturesMenu />
			<OrderProcessSection />
			<Footer />
		</main>
	);
}
