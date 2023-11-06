import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/pages/Dropdown/DropDownButton';
import Map from 'src/pages/Map/Map';
import AutoCompleteSearchBar from 'src/pages/AutoComplete/AutoCompleteSearchBar';
import SearchNearbyButton from 'src/pages/SearchNearby/SearchNearbyButton';

function App() {
	const [chosenCity, setChosenCity] = useState('Wybierz konkretne miasto');
	const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | undefined>(undefined);
	const [count, setCount] = useState(0);

	return (
		<div className='app'>
			<div className='side-bar'>
				<h1>15-Minute City</h1>
				<AutoCompleteSearchBar placeholder='Podaj dokładny adres ...' setSelectedLocation={setSelectedLocation} />
				<SearchNearbyButton setCount={setCount} />
			</div>
			<div className='main-container'>
				<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
				<Map chosenCity={chosenCity} selectedLocation={selectedLocation} count={count} />
			</div>
		</div>
	);
}

export default App;
