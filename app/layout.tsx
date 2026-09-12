import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';
const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
	subsets: ['latin'],
	variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Krum³ | Home-Made Premium Cookies in Gujrat',
	description:
		'Order fresh, home-made artisanal cookies with gooey centers in Gujrat. Try our signature Very Velvet, Nutella Bomb, Lotus Biscoff, and Peanut Blitz cookies. Order via WhatsApp!',
	keywords: [
		'Krum3 cookies',
		'Krum 3',
		'Krum three',
		'home-made cookies Gujrat',
		'artisanal cookies Pakistan',
		'Nutella cookies Gujrat',
		'cookie delivery Gujrat',
	],
	authors: [{ name: 'Krum³ Brothers' }],
	openGraph: {
		title: 'Krum³ | Home-Made Premium Cookies in Gujrat',
		description:
			'Crisp on the outside, molten on the inside. Freshly baked artisanal cookies delivered in Gujrat.',
		url: 'https://krumthree.pk',
		siteName: 'Krum³',
		locale: 'en_PK',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className='scroll-smooth'>
			<body
				className={`${poppins.className} ${playfair.variable} ${jakarta.variable} bg-cream selection:bg-forest text-forest-dark selection:text-white antialiased`}
			>
				<StoreProvider>
					<Analytics />
					<SpeedInsights />
					{children}
				</StoreProvider>
			</body>
		</html>
	);
}
