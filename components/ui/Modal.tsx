'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
	footer?: ReactNode; // Added footer prop
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
};

export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	footer,
	maxWidth = 'lg',
}: ModalProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		if (isOpen) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.body.style.overflow = 'unset';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className='z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 animate-in duration-200 fade-in'>
			{/* Backdrop click to close */}
			<div
				className='fixed inset-0'
				onClick={onClose}
				aria-hidden='true'
			/>

			{/* Modal Dialog Content */}
			<div
				className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}
			>
				{/* Header */}
				{(title || description) && (
					<div className='flex justify-between items-start p-5 border-gray-100 border-b shrink-0'>
						<div>
							{title && (
								<h3 className='font-bold text-gray-900 text-lg'>
									{title}
								</h3>
							)}
							{description && (
								<p className='mt-1 text-gray-500 text-xs'>
									{description}
								</p>
							)}
						</div>
						<button
							type='button'
							onClick={onClose}
							className='hover:bg-gray-100 p-1 rounded-lg text-gray-400 hover:text-gray-600 transition'
						>
							<X size={20} />
							<span className='sr-only'>Close modal</span>
						</button>
					</div>
				)}

				{/* Body (Scrollable) */}
				<div className='flex-1 p-6 overflow-y-auto'>{children}</div>

				{/* Footer (Pinned to bottom) */}
				{footer && (
					<div className='flex justify-end items-center gap-3 bg-gray-50/50 p-4 border-gray-100 border-t shrink-0'>
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
