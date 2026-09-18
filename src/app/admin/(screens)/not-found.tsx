import Button from '@/components/admin/Button';
import Link from 'next/link';

export default function AdminNotFound() {
	return (
		<div className='flex flex-col justify-center items-center gap-4 min-h-[60vh]'>
			<h1 className='font-bold text-gray-800 text-4xl'>
				404 - Admin Page Not Found
			</h1>
			<p className='text-gray-500'>
				The admin page or resource you are looking for does not exist.
			</p>
			<Link href={'/admin/dashboard'}>
				<Button className='bg-primary hover:bg-primary/95 font-semibold text-white'>
					Back to dashboard
				</Button>
			</Link>
		</div>
	);
}
