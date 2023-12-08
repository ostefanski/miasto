import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/Components/Dropdown/DropDownButton';
import Map from 'src/Components/Map/Map';
import AutoCompleteSearchBar from 'src/Components/AutoComplete/AutoCompleteSearchBar';
import SearchNearbyButton from 'src/Components/SearchNearby/SearchNearbyButton';
import ShowPlaceDetails from 'src/Components/ShowDetails/ShowPlaceDetails';
import DropDownCategoriesSearch from 'src/Components/Categories/DropDownCategoriesSearch';
import TransportationButton from 'src/Components/TransportMode/TransportButton';
import Help from 'src/Components/HelpCenter/Help';
import AreaButton from 'src/Components/AreaMode/AreaButton';
import Menu from 'src/Components/MenuList/Menu';

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
	const [activeAreaButton, setActiveAreaButton] = useState('15');

	return (
		<div className='app'>
			<div className='side-bar'>
				<h1>15-Minute City</h1>
				<AutoCompleteSearchBar placeholder='Podaj dokładny adres ...' setSelectedLocation={setSelectedLocation} />
				<SearchNearbyButton setCount={setCount} />
				<ShowPlaceDetails showPlaceInfo={showPlaceInfo} />
			</div>
			<div className='main-container'>
				<Help />
				<div className='dropdowns'>
					<div className='dropdown'>
						<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
					</div>
					<div className='dropdown'>
						<DropDownCategoriesSearch setCategoriesTypes={setCategoriesTypes} />
					</div>
					<Menu />
				</div>
				<div className='map-container'>
					<Map
						chosenCity={chosenCity}
						selectedLocation={selectedLocation}
						count={count}
						setShowPlaceInfo={setShowPlaceInfo}
						categoriesTypes={categoriesTypes}
						activeTransportButton={activeTransportButton}
						activeAreaButton={activeAreaButton}
					/>
					<div className='over_map_transport'>
						<TransportationButton setActiveTransportButton={setActiveTransportButton} />
					</div>
					<div className='over_map_area'>
						<AreaButton setActiveAreaButton={setActiveAreaButton} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
