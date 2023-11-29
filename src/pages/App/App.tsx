import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/pages/Dropdown/DropDownButton';
import Map from 'src/pages/Map/Map';
import AutoCompleteSearchBar from 'src/pages/AutoComplete/AutoCompleteSearchBar';
import SearchNearbyButton from 'src/pages/SearchNearby/SearchNearbyButton';
import ShowPlaceDetails from 'src/pages/ShowDetails/ShowPlaceDetails';
import DropDownCategoriesSearch from 'src/pages/Categories/DropDownCategoriesSearch';

function App() {
	const [chosenCity, setChosenCity] = useState('Wybierz konkretne miasto');
	const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | undefined>(undefined);
	const [count, setCount] = useState(0);
	const [showPlaceInfo, setShowPlaceInfo] = useState({
		name: '',
		formattedAddress: '',
		duration: '',
		distance: '',
	});

	return (
		<div className='app'>
			<div className='side-bar'>
				<h1>15-Minute City</h1>
				<AutoCompleteSearchBar placeholder='Podaj dokładny adres ...' setSelectedLocation={setSelectedLocation} />
				<SearchNearbyButton setCount={setCount} />
				<ShowPlaceDetails showPlaceInfo={showPlaceInfo} />
			</div>
			<div className='main-container'>
				<div className='dropdowns'>
					<div className='dropdown'>
						<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
					</div>
					<div className='dropdown'>
						<DropDownCategoriesSearch />
					</div>
				</div>
				<div className='map-container'>
					<Map
						chosenCity={chosenCity}
						selectedLocation={selectedLocation}
						count={count}
						setShowPlaceInfo={setShowPlaceInfo}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
