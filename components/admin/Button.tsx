import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<ButtonProps> {
	children: React.ReactNode;
}

const Button = ({ children, className, ...rest }: ButtonProps) => {
	return (
		// @ts-ignore
		<button
			className={` px-12 py-2 flex items-center justify-center rounded ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
