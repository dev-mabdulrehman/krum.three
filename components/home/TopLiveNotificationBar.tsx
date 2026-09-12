
function TopLiveNotificationBar() {
	return (
		<div
			className='bg-tertiary px-margin-mobile py-2 w-full text-on-tertiary text-center transition-all duration-300'
			id='cms-banner-display'
		>
			<div className='text-tertiary-fixed flex justify-center items-center gap-space-xs mx-auto font-label-sm text-label-sm uppercase max-w-max-content-width tracking-wider'>
				<span className='bg-secondary rounded-full w-2 h-2 animate-ping'></span>
				<span id='banner-text'>
					Morning Bake Out of Oven: 14 Fresh Boxes Remaining in Gujrat
					Studio Today
				</span>
				<span className='opacity-40'>•</span>
				<button className='font-bold hover:text-white underline transition-colors'>
					Curate Box of 4
				</button>
			</div>
		</div>
	);
}

export default TopLiveNotificationBar;
