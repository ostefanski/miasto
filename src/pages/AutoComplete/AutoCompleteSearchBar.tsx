import { useState, useEffect, useRef } from 'react';
import './AutoCompleteSearchBar.css';
import SearchIcon from 'src/assets/search.svg';
import ClearIcon from 'src/assets/clear.svg';
import { initAutocompleteService } from 'src/utils/GoogleApi';

function AutoCompleteSearchBar({ placeholder }) {
	const [searchText, setSearchText] = useState('');
	const inputElement = useRef<HTMLInputElement | null>(null); // Add type for inputElement
	const markerInstance = useRef<google.maps.Marker | null>(null); // Ref for the marker

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		setSearchText(inputValue);
	};

	const handleClearClick = () => {
		setSearchText('');
	};

	const onPlaceChanged = (autocomplete: google.maps.places.Autocomplete) => {
		const place = autocomplete.getPlace();

		// if (place.geometry && mapInstance.current) {
		//   const location = place.geometry.location;
		//   mapInstance.current.setCenter(location);

		//   if (!markerInstance.current) {
		//     markerInstance.current = new google.maps.Marker({
		//       position: location,
		//       map: mapInstance.current,
		//     });
		//   } else {
		//     markerInstance.current.setPosition(location);
		//   }
		// }
	};

	const handleAutocomplete = async () => {
		if (inputElement.current) {
			const autocomplete = await initAutocompleteService(inputElement.current);
			autocomplete.addListener('place_changed', () => onPlaceChanged(autocomplete));
		}
	};

	useEffect(() => {
		handleAutocomplete();
	});

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
