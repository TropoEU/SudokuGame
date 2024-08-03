import React from 'react';
import '../Styles/Button.css'; // Adjust the path as necessary

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	className = '',
	disabled = false,
	type = 'button',
	fullWidth = false,
}) => {
	return (
		<button
			type={type}
			className={`custom-button ${className} ${fullWidth ? 'full-width' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
