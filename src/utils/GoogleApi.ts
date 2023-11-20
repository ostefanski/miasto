import { Loader } from '@googlemaps/js-api-loader';
import { mapStyle } from 'src/utils/mapStyle';

const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GoogleApiLoader = new Loader({
	apiKey,
	version: 'weekly',
});

// Function to initialize the map
export const initMap = async (map: HTMLElement, position: google.maps.LatLngLiteral) => {
	const mapInitialization = await GoogleApiLoader.importLibrary('maps');

	const maxLat = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;

	// map options
	const mapOptions = {
		center: position, // Set initial center
		zoom: 12,
		minZoom: 3,
		disableDefaultUI: true,
		clickableIcons: false,
		styles: mapStyle,
		restriction: {
			latLngBounds: { north: maxLat, south: -maxLat, west: -180, east: 180 },
			strictBounds: true,
		},
	};

	return new mapInitialization.Map(map, mapOptions);
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
