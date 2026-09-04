export default function ComingSoon() {
	return (
		<main className='flex flex-col justify-center items-center bg-forest px-6 min-h-screen text-white text-center'>
			<div className='mx-auto max-w-lg'>
				{/* Brand Tag */}
				<span className='inline-block bg-forest-light shadow-inner mb-6 px-4 py-1.5 rounded-full font-bold text-cream text-xs uppercase tracking-widest'>
					Coming Soon to Gujrat
				</span>

				{/* Heading */}
				<h1 className='mb-4 font-extrabold text-4xl sm:text-5xl tracking-tight'>
					Our Ovens Are Heating Up 🍪
				</h1>

				{/* Description */}
				<p className='mb-8 text-cream/90 text-base sm:text-lg leading-relaxed'>
					Three brothers are crafting Gujrat’s most indulgent
					artisanal cookies with molten centers. Crisp on the outside,
					gooey on the inside.
				</p>

				{/* WhatsApp Early Access Box */}
				<div className='bg-forest-dark shadow-xl p-6 border border-white/10 rounded-2xl'>
					<p className='mb-3 font-semibold text-white text-sm'>
						Want early access and a secret menu invite?
					</p>
					<a
						href='https://wa.me/923033357863?text=Hey%20Krum3%20Brothers,%20add%20me%20to%20the%20early%20access%20waitlist!'
						target='_blank'
						rel='noopener noreferrer'
						className='inline-block bg-cream hover:bg-cream-dark shadow-md py-3.5 rounded-xl w-full font-bold text-forest text-sm active:scale-95 transition duration-200'
					>
						Join WhatsApp Waitlist
					</a>
				</div>

				{/* Footer info */}
				<p className='mt-12 text-cream/60 text-xs'>
					&copy; 2026 Krum³. All rights reserved.
				</p>
			</div>
		</main>
	);
}
