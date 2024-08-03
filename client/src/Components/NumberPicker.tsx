import React, { useEffect, useRef, useState } from 'react';
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
	const [position, setPosition] = useState({ top, left });

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

	useEffect(() => {
		const adjustPosition = () => {
			if (pickerRef.current) {
				const { offsetWidth } = pickerRef.current;
				let adjustedTop = top;
				let adjustedLeft = left;

				// Adjust if the picker is outside the right edge
				if (left + offsetWidth > window.innerWidth) {
					adjustedLeft = window.innerWidth - offsetWidth / 2 - 15; // add margin
				}

				// Adjust if the picker is outside the left edge
				if (left < offsetWidth / 2) {
					adjustedLeft = offsetWidth / 2 + 5; // add margin
				}

				setPosition({ top: adjustedTop, left: adjustedLeft });
			}
		};

		adjustPosition();
	}, [top, left]);

	return ReactDOM.createPortal(
		<div
			ref={pickerRef}
			className='number-picker'
			style={{ top: `${position.top}px`, left: `${position.left}px` }}
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
