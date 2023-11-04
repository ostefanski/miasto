import { LegacyRef, useEffect, useRef } from 'react';
import './Map.css';
import { initMap, initMarker } from 'src/utils/GoogleApi';

type MapProps = {
	chosenCity: string;
};

const Map: React.FC<MapProps> = ({ chosenCity }) => {
	const mapRef = useRef<HTMLElement | null>(null);
	const mapInstance = useRef<google.maps.Map | null>(null);

	const getCityPosition = (city: string): google.maps.LatLngLiteral => {
		switch (city) {
			case 'Gdańsk':
				return { lat: 54.35332995340486, lng: 18.64627928133993 };
			case 'Gdynia':
				return { lat: 54.51966953334585, lng: 18.523550038682206 };
			case 'Sopot':
				return { lat: 54.44162461954634, lng: 18.559612587679123 };
			default:
				return { lat: 54.39610635977299, lng: 18.57432100727402 };
		}
	};

	const initMapWithMarker = async () => {
		const position = getCityPosition(chosenCity);

		// Setup the map
		if (mapRef.current !== null) {
			mapInstance.current = await initMap(mapRef.current, position);
			initMarker(position, mapInstance.current);
		}
	};

	useEffect(() => {
		// Initialize the map and marker only when the component is mounted
		if (mapInstance.current === null) {
			initMapWithMarker();
		} else {
			// If the map is already initialized, just pan to the new position
			mapInstance.current.panTo(getCityPosition(chosenCity));
		}
	});

	return <div ref={mapRef as LegacyRef<HTMLDivElement>} className='map' />;
};

export default Map;
