import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/pages/Dropdown/DropDownButton';
import Map from 'src/pages/Map/Map';
import AutoCompleteSearchBar from 'src/pages/AutoComplete/AutoCompleteSearchBar';

function App() {
	const [chosenCity, setChosenCity] = useState('Wybierz konkretne miasto');

	return (
		<div className='app'>
			<div className='side-bar'>
				<h1>15-Minute City</h1>
				<AutoCompleteSearchBar placeholder='Podaj dokładny adres ...' />
			</div>
			<div className='main-container'>
				<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
				<Map chosenCity={chosenCity} />
			</div>
		</div>
	);
}

export default App;
