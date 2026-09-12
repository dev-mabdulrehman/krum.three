const FormHeader = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<h3 className={`font-poppins font-bold text-lg ${className}`}>
			{children}
		</h3>
	);
};

export default FormHeader;
