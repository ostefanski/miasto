import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ViewsHistory from './ViewsHistory';
import { useState } from 'react';

const App = () => {
	interface SavedView {
		name: string;
		markers: { lat: number; lng: number }[];
	}

	const [viewMarkersLocations, setViewMarkersLocations] = useState<google.maps.LatLng[]>();
	const [savedViewsInfo, setSavedViewsInfo] = useState<SavedView[]>([]);

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						<Home
							viewMarkersLocations={viewMarkersLocations}
							setViewMarkersLocations={setViewMarkersLocations}
							setSavedViewsInfo={setSavedViewsInfo}
						/>
					}
				/>
				<Route path='/Views' element={<ViewsHistory savedViewsInfo={savedViewsInfo} />} />
			</Routes>
		</Router>
	);
};

export default App;
