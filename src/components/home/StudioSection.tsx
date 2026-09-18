'use client';

export default function StudioSection() {
	return (
		<section id='studio' className='bg-primary py-16 text-on-primary'>
			<div className='items-center gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-space-md max-w-6xl'>
				<div>
					<span className='font-label-sm font-bold text-tertiary-container uppercase tracking-wider'>
						Visit Our Bakery
					</span>
					<h2 className='mt-1 font-display font-bold text-white text-3xl'>
						Gujrat Studio & Dispatch
					</h2>
					<p className='mt-3 max-w-md font-body-md text-on-primary/80'>
						Pick up hot cookies straight out of the oven or request
						same-day dispatch across the city.
					</p>

					<div className='space-y-2 mt-6'>
						<div className='flex items-center gap-2'>
							<span className='text-[20px] text-tertiary-container material-symbols-outlined'>
								location_on
							</span>
							<span className='font-body-md'>
								Krum³ Studio, Court Road, Gujrat
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='text-[20px] text-tertiary-container material-symbols-outlined'>
								schedule
							</span>
							<span className='font-body-md'>
								Open Daily: 12:00 PM – 10:00 PM
							</span>
						</div>
					</div>
				</div>

				<div className='space-y-4 bg-primary-container p-6 rounded-2xl'>
					<h3 className='font-headline-sm font-bold text-headline-sm text-on-primary-container'>
						Got an event or bulk order?
					</h3>
					<p className='font-body-md text-on-primary-container/80'>
						We curate custom cookie boxes and catering trays for
						weddings, corporate gifts, and celebrations.
					</p>
					<a
						href='https://wa.me/923008475786'
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-2 bg-secondary hover:opacity-90 px-5 py-3 rounded-xl font-label-md font-bold text-on-secondary transition-opacity'
					>
						<span className='material-symbols-outlined'>chat</span>
						<span>Contact Studio Manager</span>
					</a>
				</div>
			</div>
		</section>
	);
}
