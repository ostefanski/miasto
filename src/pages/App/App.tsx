import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ViewsHistory from './ViewsHistory';
import { useState } from 'react';

const App = () => {
	interface SavedView {
		name: string;
		markersWithIcons: { marker: { lat: number; lng: number }; originalIcon: string }[];
	}

	const [viewMarkersLocations, setViewMarkersLocations] = useState<
		Array<{
			marker?: google.maps.LatLng;
			originalIcon?: string;
		}>
	>([]);

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
