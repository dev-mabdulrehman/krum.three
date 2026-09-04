import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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
				className={`${poppins.className} bg-cream selection:bg-forest text-forest-dark selection:text-white antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
