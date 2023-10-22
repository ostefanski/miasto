import { useState } from 'react';
import './App.css';
import DropDownButton from 'src/pages/Dropdown/DropDownButton';
import Map from 'src/pages/Map/Map';

function App() {
	const [chosenCity, setChosenCity] = useState('Wybierz konkretne miasto');

	return (
		<div className='app'>
			<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
			<Map chosenCity={chosenCity} />
		</div>
	);
}

export default App;
