import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			helperText,
			icon,
			rightIcon,
			className = '',
			id,
			...rest
		},
		ref,
	) => {
		const inputId = id || rest.name;

		return (
			<div className={`flex flex-col gap-1 w-full ${className}`}>
				{label && (
					<label
						htmlFor={inputId}
						className='font-medium text-gray-700 text-sm'
					>
						{label}
						{rest.required && (
							<span className='ml-1 text-red-500'>*</span>
						)}
					</label>
				)}

				<div className='relative flex items-center'>
					{/* Left Icon */}
					{Boolean(icon) && (
						<span
							className={`top-1/2 left-2.5 absolute flex justify-center items-center w-5 h-5   ${error ? 'text-on-error-container' : 'text-primary'} -translate-y-1/2 pointer-events-none`}
						>
							{icon}
						</span>
					)}

					{/* Input Field */}
					<input
						id={inputId}
						ref={ref}
						{...rest}
						className={`w-full p-2 text-sm border rounded outline-none transition-colors ${
							icon ? 'pl-9' : 'pl-3'
						} ${rightIcon ? 'pr-9' : 'pr-3'} ${
							error
								? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
								: 'border-black/10 focus:border-black/40'
						}`}
					/>

					{/* Right Icon */}
					{Boolean(rightIcon) && (
						<span className='top-1/2 right-2.5 absolute flex justify-center items-center w-5 h-5 text-gray-500 -translate-y-1/2'>
							{rightIcon}
						</span>
					)}
				</div>

				{/* Error or Helper Message */}
				{error ? (
					<span className='font-medium text-red-500 text-xs'>
						{error}
					</span>
				) : helperText ? (
					<span className='text-gray-500 text-xs'>{helperText}</span>
				) : null}
			</div>
		);
	},
);

Input.displayName = 'Input';

export default Input;
