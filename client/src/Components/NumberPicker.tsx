import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../Styles/NumberPicker.css'; // Optional: For custom styles

interface NumberPickerProps {
	top: number;
	left: number;
	onSelect: (number: string) => void;
	onClose: () => void;
}

const NumberPicker: React.FC<NumberPickerProps> = ({
	top,
	left,
	onSelect,
	onClose,
}) => {
	const pickerRef = useRef<HTMLDivElement | null>(null);

	const handleClick = (number: string) => {
		onSelect(number);
		onClose(); // Close the picker after selecting a number
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
				onClose(); // Close the picker if click is outside
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	return ReactDOM.createPortal(
		<div
			ref={pickerRef}
			className='number-picker'
			style={{ top: `${top}px`, left: `${left}px` }}
		>
			<div className='number-picker-grid'>
				{Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
					<div
						key={number}
						className='number-picker-cell'
						onClick={() => handleClick(number.toString())}
					>
						{number}
					</div>
				))}
			</div>
		</div>,
		document.body, // Render the picker into the body element
	);
};

export default NumberPicker; // Use default export
