import { useState } from 'react';
import './DropDownButton.css';
import icon from './button.svg';

function Dropdown({ chosenCity, setChosenCity }) {
	const [isActive, setIsActive] = useState(false);
	const options = ['Gdańsk', 'Gdynia', 'Sopot'];

	const toggleDropdown = () => {
		setIsActive(!isActive);
	};

	return (
		<div className='dropdown'>
			<div className='dropdown-btn' onClick={toggleDropdown}>
				{chosenCity}
				<span>
					<img src={icon} alt='Dropdown Icon' />
				</span>
			</div>
			{isActive && (
				<div className='dropdown-content'>
					{options.map((option) => (
						<div
							key={option}
							onClick={() => {
								setChosenCity(option);
								setIsActive(false);
							}}
							className='dropdown-item'
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Dropdown;
