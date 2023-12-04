import { useState } from 'react';
import './DropDownButton.css';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function Dropdown({ chosenCity, setChosenCity }) {
	const [isActive, setIsActive] = useState(false);

	const handleChange = (event: SelectChangeEvent) => {
		const selectedCity = event.target.value as string;
		setChosenCity(selectedCity);
		setIsActive(false);
	};

	const handleNoneClick = () => {
		setChosenCity(''); // Set an empty string or another default value
		setIsActive(false);
	};

	const options = ['Gdańsk', 'Gdynia', 'Sopot'];

	return (
		<Box className='dropdown'>
			<FormControl fullWidth>
				<InputLabel id='dropdown-label'>Wybierz miasto</InputLabel>
				<Select
					labelId='dropdown-label'
					id='dropdown'
					value={chosenCity}
					label='Wybierz miasto'
					open={isActive}
					onClose={() => setIsActive(false)}
					onOpen={() => setIsActive(true)}
					onChange={handleChange}
				>
					<MenuItem value='' onClick={handleNoneClick}>
						Brak
					</MenuItem>
					{options.map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

export default Dropdown;
