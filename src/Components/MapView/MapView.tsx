import { useEffect, useRef } from 'react';
import { initMap } from 'src/utils/GoogleApi';

interface SavedView {
	name: string;
	markersWithIcons: { marker: { lat: number; lng: number }; originalIcon: string }[];
}

function MapView({ savedViewsInfo }: { savedViewsInfo: SavedView }) {
	const mapRef = useRef(null);
	const mapInstance = useRef<google.maps.Map | null>(null);

	useEffect(() => {
		const initializeMap = async () => {
			if (mapRef.current && savedViewsInfo.markersWithIcons && savedViewsInfo.markersWithIcons.length > 0) {
				mapInstance.current = await initMap(mapRef.current, savedViewsInfo.markersWithIcons[0].marker);

				savedViewsInfo.markersWithIcons.forEach(({ marker, originalIcon }) => {
					new google.maps.Marker({
						position: marker,
						map: mapInstance.current,
						icon: originalIcon,
					});
				});
			}
		};

		if (!mapInstance.current) {
			initializeMap();
		}
	}, [savedViewsInfo]);

	return <div ref={mapRef} style={{ height: '80vh', width: '80%' }} className='map-view'></div>;
}

export default MapView;
