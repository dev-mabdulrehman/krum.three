import { Star } from 'lucide-react';

interface StarsProps {
	rating?: number;
}

const TOTAL_STARS = 5;

const Stars = ({ rating = 0 }: StarsProps) => {
	let solidStars = Math.round(Number(rating));
	let hollowStars = TOTAL_STARS - solidStars;
	return (
		<div className='flex flex-row'>
			{new Array(solidStars).fill(1).map((_, index) => (
				<Star
					key={`solidStar-${index}`}
					size={12}
					fill='true'
					className='fill-primary text-primary'
				/>
			))}
			{new Array(hollowStars).fill(1).map((_, index) => (
				<Star
					key={`hollowStar-${index}`}
					size={12}
					className='text-primary'
				/>
			))}
		</div>
	);
};

export default Stars;
