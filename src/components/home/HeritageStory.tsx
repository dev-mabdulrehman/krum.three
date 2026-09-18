'use client';


export default function HeritageStory() {
	return (
		<section id='heritage' className='mx-auto px-space-md py-20 max-w-6xl'>
			<div className='items-center gap-12 grid grid-cols-1 md:grid-cols-2'>
				<div className='relative shadow-xl rounded-3xl aspect-4/3 overflow-hidden'>
					{/* <Image
						src='https://lh3.googleusercontent.com/aida-public/AB6AXuDScN4ZvLMGdAx9hApWC6otpfCKO5qw9TplVlmZeOgcHD7ZdsIdY0yMrDorDpU6cykOm-vSjM-ZvcQHRGHKW7J_y2XK1FjsFBcRYju__lFgXRNBL2ctaE2UitBr6B3jLdlSeFX6KbMCLWqKI9BMf87tg7w3vr4X32nUE89k4D_40d2R3-UiJc8A1uMrtuey6CbBz3_YzbBgrAJnGVnEXNeitD_p_KUf5HwqcGZK4N6SVM9ZDwdws2lbxw'
						alt='Krum³ Artisanal Process'
						fill
						className='object-cover'
					/> */}
				</div>

				<div className='space-y-4'>
					<span className='font-label-sm font-bold text-secondary uppercase tracking-widest'>
						Our Craftsmanship
					</span>
					<h2 className='font-display font-bold text-primary text-3xl md:text-4xl'>
						Built on Slow Temperature, Precision & Butter
					</h2>
					<p className='font-body-md text-on-surface-variant leading-relaxed'>
						Every cookie starts with a 48-hour cold-fermented brown
						butter dough. We hand-stuff each center with molten
						fillings and bake in precise micro-batches to guarantee
						a crispy edge and soft, gooey core.
					</p>
					<div className='gap-4 grid grid-cols-2 pt-4 border-t border-outline-variant/30'>
						<div>
							<span className='font-display font-bold text-primary text-2xl'>
								180g
							</span>
							<p className='font-label-sm text-on-surface-variant'>
								Heavyweight Size
							</p>
						</div>
						<div>
							<span className='font-display font-bold text-primary text-2xl'>
								48 Hours
							</span>
							<p className='font-label-sm text-on-surface-variant'>
								Dough Rest
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
