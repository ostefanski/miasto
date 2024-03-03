import { useEffect, useRef } from 'react';
import { initMap } from 'src/utils/GoogleApi';

function MapView({ savedViewsInfo }) {
	const mapRef = useRef(null);
	const mapInstance = useRef<google.maps.Map | null>(null);

	useEffect(() => {
		const initializeMap = async () => {
			if (mapRef.current && savedViewsInfo.markers && savedViewsInfo.markers.length > 0) {
				mapInstance.current = await initMap(mapRef.current, savedViewsInfo.markers[0]);

				savedViewsInfo.markers.forEach((marker) => {
					new google.maps.Marker({
						position: { lat: marker.lat, lng: marker.lng },
						map: mapInstance.current,
					});
				});
			}
		};

		if (!mapInstance.current) {
			initializeMap();
		}
	}, [savedViewsInfo]);

	return <div ref={mapRef} style={{ height: '50vh', width: '50%' }} className='map-view'></div>;
}

export default MapView;
