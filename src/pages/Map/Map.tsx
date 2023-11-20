import { LegacyRef, useEffect, useRef } from 'react';
import './Map.css';
import { initMap } from 'src/utils/GoogleApi';

type MapProps = {
	chosenCity: string;
	selectedLocation: google.maps.LatLng | undefined;
	count: number;
};

const Map: React.FC<MapProps> = ({ chosenCity, selectedLocation, count }) => {
	const mapRef = useRef<HTMLElement | null>(null);
	const mapInstance = useRef<google.maps.Map | null>(null);
	const markerInstance = useRef<google.maps.Marker | null>(null);
	const redCircleinstance = useRef<google.maps.Circle | null>(null);
	const greenCircleinstance = useRef<google.maps.Circle | null>(null);
	const nearbyMarkersInstance = useRef<google.maps.Marker[] | null>(null);
	const previousMarkerInstancePosition = useRef<google.maps.LatLng | null | undefined>(null);
	const directionsRenderinstance = useRef<google.maps.DirectionsRenderer | null>(null);

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

	const createCircles = async (defaultLocation) => {
		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		if (defaultLocation) {
			//red Circle
			redCircleinstance.current = new google.maps.Circle({
				strokeColor: '#FF5252',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF5252',
				fillOpacity: 0.05,
				zIndex: 2,
				clickable: false,
				draggable: false,
				editable: false,
				visible: true,
				map: mapInstance.current,
				center: defaultLocation,
				radius: 2200,
			});

			// green Circle
			greenCircleinstance.current = new google.maps.Circle({
				strokeColor: '#8BC34A',
				strokeOpacity: 0.5,
				strokeWeight: 2,
				fillColor: '#8BC34A',
				fillOpacity: 0.05,
				zIndex: 3,
				clickable: false,
				draggable: false,
				editable: false,
				visible: true,
				map: mapInstance.current,
				center: defaultLocation,
				radius: 1100,
			});
		}
	};

	const findNearbyPlaces = async (defaultLocation) => {
		const types = ['university']; // 'hospital', , 'bus_station', 'police', 'doctor', 'school', 'bank', 'store'

		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		// Create a PlacesService instance
		const service = new google.maps.places.PlacesService(mapInstance.current);

		// Define the request parameters
		const request = {
			location: defaultLocation,
			radius: 1100, // 1.1 km
			types: types,
		};

		const nearbyMarkers: google.maps.Marker[] = [];

		let nearestPlace: google.maps.places.PlaceResult | null = null;
		let nearestDistance = Number.POSITIVE_INFINITY;

		// Send the nearby search request
		service.nearbySearch(request, (results, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && results) {
				// Loop through the results and add markers to the map
				results.forEach((place) => {
					if (place.geometry && place.geometry.location) {
						const distance = google.maps.geometry.spherical.computeDistanceBetween(
							defaultLocation,
							place.geometry.location
						);

						if (distance < nearestDistance) {
							nearestDistance = distance;
							nearestPlace = place;
						}

						const nearbyMarker = new google.maps.Marker({
							position: place.geometry.location,
							map: mapInstance.current,
							title: place.name,
							visible: true,
						});

						nearbyMarkers.push(nearbyMarker);

						// event listener for clicking any marker to show directions
						google.maps.event.addListener(nearbyMarker, 'click', () => {
							clearDirections(); // clear directions from previous marker
							CalculateAndDisplayDirections(defaultLocation, place.geometry?.location);
						});
					}
				});
				// display direction of nearest place by default
				if (nearestPlace) {
					CalculateAndDisplayDirections(defaultLocation, nearestPlace.geometry?.location);
				}
			}
		});
		nearbyMarkersInstance.current = nearbyMarkers;
	};

	const CalculateAndDisplayDirections = (origin, destination) => {
		const directionsService = new google.maps.DirectionsService();
		// const directionsRender = new google.maps.DirectionsRenderer();

		if (directionsRenderinstance.current === null) {
			directionsRenderinstance.current = new google.maps.DirectionsRenderer({
				preserveViewport: true,
			});
		}

		// const directionsRender = directionsRenderinstance.current;

		directionsRenderinstance.current.setOptions({
			suppressMarkers: true,
			polylineOptions: {
				zIndex: 50,
				strokeColor: '#1976D2',
				strokeWeight: 5,
			},
		});

		directionsRenderinstance.current.setMap(mapInstance.current);

		const request = {
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.WALKING,
		};

		directionsService.route(request, (response, status) => {
			if (status === google.maps.DirectionsStatus.OK && directionsRenderinstance.current) {
				mapInstance.current?.setZoom(15);
				directionsRenderinstance.current.setDirections(response);
			} else {
				console.error('Error while calculating directions', status);
			}
		});
	};

	const clearDirections = () => {
		if (directionsRenderinstance.current !== null) {
			console.log('cleared');
			directionsRenderinstance.current.setMap(null); // detach directions from the map
			// directionsRenderinstance.current.setDirections(null); // Clear the directions by setting it to null
		}
	};

	const clearCirclesandNearbyMarkers = () => {
		if (greenCircleinstance.current?.getVisible()) {
			greenCircleinstance.current?.setVisible(false);
			redCircleinstance.current?.setVisible(false);
			nearbyMarkersInstance.current?.forEach((marker) => {
				marker.setVisible(false);
			});
		}
	};

	const initMapWithMarker = async () => {
		const position = getCityPosition(chosenCity);

		const blueMarkerIcon = {
			url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
		};

		// Setup the map
		if (mapRef.current !== null) {
			mapInstance.current = await initMap(mapRef.current, position);

			markerInstance.current = new google.maps.Marker({
				position: position,
				map: mapInstance.current,
				visible: false,
				icon: blueMarkerIcon,
			});

			markerInstance.current.addListener('click', () => {
				clearDirections();
				markerInstance.current?.setVisible(false);
				greenCircleinstance.current?.setVisible(false);
				redCircleinstance.current?.setVisible(false);
				nearbyMarkersInstance.current?.forEach((marker) => {
					marker.setVisible(false);
				});
			});

			mapInstance.current.addListener('click', (event) => {
				const clickedLocation = event.latLng;
				markerInstance.current?.setPosition(clickedLocation);
				markerInstance.current?.setVisible(true);
				mapInstance.current?.panTo(clickedLocation);
				mapInstance.current?.setZoom(12);

				// clear previous directions if they exist
				clearDirections();
				// clear the previous circles and markers if they exist
				clearCirclesandNearbyMarkers();
			});
		}
	};

	useEffect(() => {
		// Initialize the map and marker only when the component is mounted
		if (mapInstance.current === null) {
			initMapWithMarker();
		} else {
			if (selectedLocation) {
				mapInstance.current?.panTo(selectedLocation);
				if (markerInstance.current) {
					markerInstance.current.setPosition(selectedLocation);
					markerInstance.current?.setVisible(true);
					mapInstance.current.setZoom(12);

					// clear previous directions if they exist
					clearDirections();
					// clear the previous circles and markers if they exist
					clearCirclesandNearbyMarkers();
				}
			}
		}
	}, [selectedLocation]);

	useEffect(() => {
		if (mapInstance.current) {
			const newCityPosition = getCityPosition(chosenCity);
			mapInstance.current.panTo(newCityPosition);
			if (markerInstance.current) {
				markerInstance.current.setPosition(newCityPosition);
				markerInstance.current.setVisible(true);
				mapInstance.current.setZoom(12);

				// clear previous directions if they exist
				clearDirections();
				// clear the previous circles and markers if they exist
				clearCirclesandNearbyMarkers();
			}
		}
	}, [chosenCity]);

	useEffect(() => {
		if (mapInstance.current) {
			if (markerInstance.current?.getVisible()) {
				const markerPosition = markerInstance.current.getPosition();

				// if marker position is different than previous one only then create new circles and markers
				if (markerPosition !== previousMarkerInstancePosition.current) {
					previousMarkerInstancePosition.current = markerPosition;
					findNearbyPlaces(markerPosition);
					createCircles(markerPosition);
					mapInstance.current.setZoom(14);
				}
			}
		}
	}, [count]);

	return <div ref={mapRef as LegacyRef<HTMLDivElement>} className='map' />;
};

export default Map;

//TODO:
// 5. informacja o dokładnej odległości między zaznaczonymi znacznikami i czasie podróży.
// 6. zmodyfikuj działanie znaczników i obszarów, jeżeli w obszarze zielonym nie ma żadnych znaczników, to powinny się
// pojawić pozostałe znaczniki z obszaru czerwonego o ile takowe istnieja.
// 7. dodać dodatkowo clusterowanie znaczników, żeby rozdzielały się w grupy w zależności od ich ilości w danym miejscu.
// 8. poprawić mape bo jak się oddala na maxa to nie ma ograniczenia i mapa się spłaszcza i zostaja szare ramki do okoła. X
// 9. poprawić i potweakować z wyszukiwaniem interesującyh nas miejsc w okół.
// 10. stworzyć możliwość wybierania kategorii miejsc które interesują użytkownika i zaadaptować logikę do tego.
// 11. ew. poprawić wyglad UI
