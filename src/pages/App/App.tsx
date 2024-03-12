import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ViewsHistory from './ViewsHistory';
import { useState } from 'react';

const App = () => {
	interface SavedView {
		name: string;
		markersWithIcons: {
			marker: { lat: number; lng: number };
			originalIcon: string;
			place: google.maps.places.PlaceResult;
		}[];
	}

	const [viewMarkersLocations, setViewMarkersLocations] = useState<
		Array<{
			marker?: google.maps.LatLng;
			originalIcon?: string;
			place?: google.maps.places.PlaceResult;
		}>
	>([]);

	const [savedViewsInfo, setSavedViewsInfo] = useState<SavedView[]>([]);
	const [activeTransportButton, setActiveTransportButton] = useState('walk');
	const [showPlaceInfo, setShowPlaceInfo] = useState({
		name: '',
		formattedAddress: '',
		duration: '',
		distance: '',
	});

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
							activeTransportButton={activeTransportButton}
							setActiveTransportButton={setActiveTransportButton}
							showPlaceInfo={showPlaceInfo}
							setShowPlaceInfo={setShowPlaceInfo}
						/>
					}
				/>
				<Route
					path='/Views'
					element={
						<ViewsHistory
							setActiveTransportButton={setActiveTransportButton}
							activeTransportButton={activeTransportButton}
							savedViewsInfo={savedViewsInfo}
							showPlaceInfo={showPlaceInfo}
							setShowPlaceInfo={setShowPlaceInfo}
						/>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
