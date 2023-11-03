import { useState } from 'react';
import './AutoCompleteSearchBar.css';
import SearchIcon from 'src/assets/search.svg';
import ClearIcon from 'src/assets/clear.svg';
import { GoogleApiLoader, initMap } from 'src/utils/GoogleApi';

function AutoCompleteSearchBar({ placeholder }) {
	const [searchText, setSearchText] = useState('');
	// const isLoaded = GoogleApiLoader;
	// const autoCompleteService = isLoaded ? new google.maps.places.AutocompleteService() : null;
	// const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[] | null>(null);

	const handleInputChange = (event) => {
		const inputValue = event.target.value;
		setSearchText(inputValue);

		// if (isLoaded && inputValue && autoCompleteService) {
		// 	autoCompleteService.getPlacePredictions({ input: inputValue }, (results, status) => {
		// 		if (status === google.maps.places.PlacesServiceStatus.OK) {
		// 			setPredictions(results);
		// 		} else {
		// 			setPredictions([]);
		// 		}
		// 	});
		// } else {
		// 	setPredictions([]);
		// }
	};

	const handleClearClick = () => {
		setSearchText('');
		// setPredictions([]); // clear the predictions
	};

	// const handlePredictionClick = (prediction) => {
	// 	setSearchText(prediction.description);
	// 	setPredictions([]); // Clear the predictions
	// };

	return (
		<div className='search-bar'>
			<input
				type='text'
				placeholder={placeholder}
				className='search-input'
				value={searchText}
				onChange={handleInputChange}
			/>
			<div className='search-icon' onClick={searchText ? handleClearClick : undefined}>
				<img src={searchText ? ClearIcon : SearchIcon} alt='Icons' />
			</div>
			{/* {predictions?.length && (
				<ul className='predictions'>
					{predictions.map((prediction) => (
						<li key={prediction.place_id} onClick={() => handlePredictionClick(prediction)}>
							{prediction.description}
						</li>
					))}
				</ul>
			)} */}
		</div>
	);
}

export default AutoCompleteSearchBar;
