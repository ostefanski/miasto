import { useState, useEffect, useRef } from 'react';
import './AutoCompleteSearchBar.css';
import SearchIcon from 'src/assets/search.svg';
import ClearIcon from 'src/assets/clear.svg';
import { initAutocompleteService } from 'src/utils/GoogleApi';

function AutoCompleteSearchBar({ placeholder, setSelectedLocation }) {
	const [searchText, setSearchText] = useState('');
	const inputElement = useRef<HTMLInputElement | null>(null); // Add type for inputElement

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		setSearchText(inputValue);
	};

	const handleClearClick = () => {
		setSearchText('');
	};

	const onPlaceChanged = (autocomplete: google.maps.places.Autocomplete) => {
		const place = autocomplete.getPlace();

		if (place.geometry) {
			const location = place.geometry.location;
			setSelectedLocation(location);
			setSearchText('');
		}
	};

	const handleAutocomplete = async () => {
		if (inputElement.current) {
			const autocomplete = await initAutocompleteService(inputElement.current);
			autocomplete.addListener('place_changed', () => onPlaceChanged(autocomplete));
		}
	};

	useEffect(() => {
		handleAutocomplete();
	}, []);

	return (
		<div className='search-bar'>
			<input
				id='autocomplete'
				type='text'
				ref={inputElement}
				placeholder={placeholder}
				className='search-input'
				value={searchText}
				onChange={handleInputChange}
			/>
			<div className='search-icon' onClick={searchText ? handleClearClick : undefined}>
				<img src={searchText ? ClearIcon : SearchIcon} alt='Icons' />
			</div>
		</div>
	);
}

export default AutoCompleteSearchBar;
