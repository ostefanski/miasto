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

export const initMarker = async (position: google.maps.LatLngLiteral, map: google.maps.Map) => {
	const marker = await GoogleApiLoader.importLibrary('marker');

	// Marker options
	const markerOptions = {
		position: position,
		map: map,
		visible: false,
	};

	// Setup the marker
	const googleMarker = new marker.Marker(markerOptions);

	googleMarker.addListener('click', () => {
		googleMarker.setVisible(false);
	});

	map.addListener('click', (event) => {
		const clickedLocation = event.latLng;
		googleMarker.setPosition(clickedLocation);
		googleMarker.setVisible(true);
	});
};

// Function to initialize the Autocomplete service
export const initAutocompleteService = async (inputElement: HTMLInputElement) => {
	const autocompleteInitialization = await GoogleApiLoader.importLibrary('places');

	const autocomplete = new autocompleteInitialization.Autocomplete(inputElement, {
		types: ['address'],
		componentRestrictions: { country: ['PL'] },
		fields: ['place_id', 'geometry', 'name'],
	});

	autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
	return autocomplete;
};
