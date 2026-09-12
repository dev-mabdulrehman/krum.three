'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	addSlotToBox,
	addToCart,
	clearBoxSlot,
	resetBoxSlots,
} from '@/store/slices/cartSlice';

export default function BoxBuilder() {
	const dispatch = useAppDispatch();
	const items = useAppSelector(state => state.menu.items);
	const boxSlots = useAppSelector(state => state.cart.boxSlots);
	const cookieList = Object.values(items);

	const filledCount = boxSlots.filter(slot => slot !== null).length;
	const isFull = filledCount === 4;
	const boxPrice = 2500; // Fixed box price offer

	const handleAddBoxToCart = () => {
		if (!isFull) return;

		const boxDescription = boxSlots.map(s => s?.name).join(', ');
		dispatch(
			addToCart({
				id: `custom-box-${Date.now()}`,
				name: `Custom 4-Box (${boxDescription})`,
				price: boxPrice,
				img: boxSlots[0]?.img || '',
				qty: 1,
				isBox: true,
			}),
		);
		dispatch(resetBoxSlots());
	};

	return (
		<section
			id='box-builder'
			className='bg-surface-container-low py-16 border-y border-outline-variant/20'
		>
			<div className='mx-auto px-space-md max-w-6xl'>
				<div className='mx-auto mb-10 max-w-xl text-center'>
					<span className='font-label-sm font-bold text-secondary uppercase tracking-widest'>
						Custom Assortment
					</span>
					<h2 className='mt-1 font-display font-bold text-primary text-3xl'>
						Build Your Signature 4-Box
					</h2>
					<p className='mt-2 font-body-md text-on-surface-variant'>
						Select any 4 cookies to craft your bespoke Krum³ box.
						Fixed price of PKR {boxPrice}.
					</p>
				</div>

				<div className='items-start gap-8 grid grid-cols-1 lg:grid-cols-12'>
					{/* Cookie Picker Grid */}
					<div className='gap-3 grid grid-cols-2 lg:col-span-7'>
						{cookieList.map(cookie => (
							<button
								key={cookie.id}
								onClick={() =>
									dispatch(
										addSlotToBox({
											name: cookie.name,
											img: cookie.imageSrc,
										}),
									)
								}
								disabled={isFull}
								className='flex items-center gap-3 bg-surface-container-lowest disabled:opacity-50 p-3 border hover:border-primary rounded-xl border-outline-variant/30 text-left active:scale-95 transition-all'
							>
								<div className='relative rounded-lg w-12 h-12 overflow-hidden shrink-0'>
									{/* <Image
										src={cookie.img}
										alt={cookie.name}
										fill
										className='object-cover'
									/> */}
								</div>
								<div>
									<h4 className='font-title-md font-semibold text-primary text-title-md line-clamp-1'>
										{cookie.name}
									</h4>
									<span className='font-label-sm text-secondary'>
										+ Add Slot
									</span>
								</div>
							</button>
						))}
					</div>

					{/* 4-Box Container */}
					<div className='lg:col-span-5 bg-surface-bright shadow-md p-6 border rounded-2xl border-outline-variant/40'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-headline-sm text-headline-sm text-primary'>
								Your Selection
							</h3>
							<span className='bg-secondary-container px-3 py-1 rounded-full font-label-md font-bold text-on-secondary-container'>
								{filledCount} / 4 Filled
							</span>
						</div>

						<div className='gap-3 grid grid-cols-2 mb-6'>
							{boxSlots.map((slot, idx) => (
								<div
									key={idx}
									className='relative flex flex-col justify-center items-center bg-surface-container p-2 border-2 border-dashed rounded-xl border-outline-variant aspect-square overflow-hidden text-center'
								>
									{slot ? (
										<>
											{/* <Image
												src={slot.img}
												alt={slot.name}
												fill
												className='object-cover'
											/> */}
											<button
												onClick={() =>
													dispatch(clearBoxSlot(idx))
												}
												className='top-2 right-2 z-10 absolute flex justify-center items-center bg-error rounded-full w-6 h-6 text-on-error'
											>
												<span className='text-[14px] material-symbols-outlined'>
													close
												</span>
											</button>
										</>
									) : (
										<span className='font-label-sm font-medium text-on-surface-variant'>
											Slot {idx + 1}
										</span>
									)}
								</div>
							))}
						</div>

						<button
							onClick={handleAddBoxToCart}
							disabled={!isFull}
							className='flex justify-center items-center gap-2 bg-primary disabled:bg-surface-container-high py-3.5 rounded-xl w-full font-label-md font-bold text-on-primary disabled:text-on-surface-variant/50 transition-all'
						>
							<span className='material-symbols-outlined'>
								add_shopping_cart
							</span>
							<span>Add Box to Basket - PKR {boxPrice}</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
