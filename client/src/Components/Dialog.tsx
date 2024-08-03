import React, { ReactNode } from 'react';
import '../Styles/Dialog.css'; // Adjust the path as necessary

interface DialogProps {
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	title?: string;
}

const Dialog: React.FC<DialogProps> = ({
	children,
	isOpen,
	onClose,
	title,
}) => {
	if (!isOpen) {
		return null;
	}

	const handleOverlayClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className='dialog-overlay' onClick={handleOverlayClick}>
			<div className='dialog'>
				<div className='dialog-header'>
					{title && <h2>{title}</h2>}
					<button className='dialog-close-button' onClick={onClose}>
						&times;
					</button>
				</div>
				<div className='dialog-content'>{children}</div>
			</div>
		</div>
	);
};

export default Dialog;
