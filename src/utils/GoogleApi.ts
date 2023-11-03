import { Loader } from '@googlemaps/js-api-loader';

const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GoogleApiLoader = new Loader({
	apiKey,
	version: 'weekly',
	libraries: ['places'],
});

// Function to initialize the map
export const initMap = async (map: HTMLElement, position: google.maps.LatLngLiteral) => {
	const mapInitialization = await GoogleApiLoader.importLibrary('maps');

	// map options
	const mapOptions = {
		center: position, // Set initial center
		zoom: 12,
		mapId: 'MY_REACT_MAPID',
		disableDefaultUI: true,
		clickableIcons: false,
	};

	return new mapInitialization.Map(map, mapOptions);
};
