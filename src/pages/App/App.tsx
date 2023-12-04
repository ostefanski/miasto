import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/Components/Dropdown/DropDownButton';
import Map from 'src/Components/Map/Map';
import AutoCompleteSearchBar from 'src/Components/AutoComplete/AutoCompleteSearchBar';
import SearchNearbyButton from 'src/Components/SearchNearby/SearchNearbyButton';
import ShowPlaceDetails from 'src/Components/ShowDetails/ShowPlaceDetails';
import DropDownCategoriesSearch from 'src/Components/Categories/DropDownCategoriesSearch';
import TransportationButton from 'src/Components/TransportMode/TransportButton';

function App() {
	const [chosenCity, setChosenCity] = useState('');
	const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | undefined>(undefined);
	const [count, setCount] = useState(0);
	const [categoriesTypes, setCategoriesTypes] = useState([]);
	const [showPlaceInfo, setShowPlaceInfo] = useState({
		name: '',
		formattedAddress: '',
		duration: '',
		distance: '',
	});
	const [activeTransportButton, setActiveTransportButton] = useState('walk');

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
						<DropDownCategoriesSearch setCategoriesTypes={setCategoriesTypes} />
					</div>
				</div>
				<div className='map-container'>
					<Map
						chosenCity={chosenCity}
						selectedLocation={selectedLocation}
						count={count}
						setShowPlaceInfo={setShowPlaceInfo}
						categoriesTypes={categoriesTypes}
						activeTransportButton={activeTransportButton}
					/>
					<div className='over_map'>
						<TransportationButton setActiveTransportButton={setActiveTransportButton} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
