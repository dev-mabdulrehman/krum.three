'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setDeliveryType,
	toggleCart,
	updateQty,
} from '@/store/slices/cartSlice';
import { ShoppingBag, X } from 'lucide-react';

export default function CartDrawer() {
	const dispatch = useAppDispatch();
	const { isOpen, items, deliveryType, deliveryFee } = useAppSelector(
		state => state.cart,
	);

	const subtotal = items.reduce(
		(acc, item) => acc + item.price * item.qty,
		0,
	);
	const total = subtotal + deliveryFee;

	const handleCheckout = () => {
		const text = items
			.map(i => `• ${i.name} (x${i.qty}) - PKR ${i.price * i.qty}`)
			.join('%0A');
		const msg = `Hello Krum³, I'd like to place an order:%0A%0A${text}%0A%0A*Delivery Type:* ${deliveryType}%0A*Total:* PKR ${total}`;
	};

	if (!isOpen) return null;

	return (
		<div className='z-50 fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity'>
			<div className='top-0 right-0 absolute flex flex-col bg-surface-bright shadow-2xl w-full max-w-md h-full'>
				{/* Header */}
				<div className='flex justify-between items-center bg-surface-container p-space-md'>
					<div className='flex items-center gap-space-xs'>
						<ShoppingBag className='text-primary' size={'24px'} />
						<div>
							<h3 className='font-headline-sm text-headline-sm text-primary'>
								Your Krum³ Basket
							</h3>
							<span className='font-label-sm text-label-sm text-on-surface-variant'>
								{items.length} items
							</span>
						</div>
					</div>
					<button
						onClick={() => dispatch(toggleCart(false))}
						className='flex justify-center items-center bg-surface-container-high rounded-full w-9 h-9 cursor-pointer'
					>
						<X />
					</button>
				</div>

				{/* Item List */}
				<div className='flex-1 space-y-3 p-space-md overflow-y-auto'>
					{items.map(item => (
						<div
							key={item.cartId}
							className='flex justify-between items-center bg-surface-container p-2 rounded-xl'
						>
							<div className='flex items-center gap-3'>
								<div className='relative rounded-lg w-12 h-12 overflow-hidden'>
									{/* <Image
										src={item.img}
										alt={item.name}
										fill
										className='object-cover'
									/> */}
								</div>
								<div>
									<span className='font-title-md font-semibold text-on-surface text-title-md line-clamp-1'>
										{item.name}
									</span>
									<span className='font-label-sm font-bold text-secondary'>
										PKR {item.price}
									</span>
								</div>
							</div>
							<div className='flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-lg'>
								<button
									onClick={() =>
										dispatch(
											updateQty({
												cartId: item.cartId,
												delta: -1,
											}),
										)
									}
									className='flex justify-center items-center w-6 h-6'
								>
									-
								</button>
								<span className='w-6 font-bold text-center'>
									{item.qty}
								</span>
								<button
									onClick={() =>
										dispatch(
											updateQty({
												cartId: item.cartId,
												delta: 1,
											}),
										)
									}
									className='flex justify-center items-center w-6 h-6'
								>
									+
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className='space-y-3 bg-surface-container-low p-space-md'>
					<div className='gap-2 grid grid-cols-2'>
						<button
							onClick={() =>
								dispatch(setDeliveryType('dispatch'))
							}
							className={`p-2 text-xs rounded-xl ${
								deliveryType === 'dispatch'
									? 'bg-primary text-white'
									: 'bg-surface-container'
							}`}
						>
							City Delivery (+150)
						</button>
						<button
							onClick={() => dispatch(setDeliveryType('pickup'))}
							className={`p-2 text-xs rounded-xl ${
								deliveryType === 'pickup'
									? 'bg-primary text-white'
									: 'bg-surface-container'
							}`}
						>
							Studio Pick-Up (Free)
						</button>
					</div>

					<div className='flex justify-between font-bold text-primary text-lg'>
						<span>Total</span>
						<span>PKR {total}</span>
					</div>

					<button
						onClick={handleCheckout}
						className='flex justify-center items-center gap-2 bg-primary py-3 rounded-xl w-full font-bold text-white'
					>
						<span>Order</span>
					</button>
				</div>
			</div>
		</div>
	);
}
