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
	// const previousCount = useRef<number>();
	const previousMarkerInstancePosition = useRef<google.maps.LatLng | null | undefined>(null);

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

		// Send the nearby search request
		service.nearbySearch(request, (results, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && results) {
				// Loop through the results and add markers to the map
				results.forEach((place) => {
					if (place.geometry && place.geometry.location) {
						const nearbyMarker = new google.maps.Marker({
							position: place.geometry.location,
							map: mapInstance.current,
							title: place.name,
							visible: true,
						});

						nearbyMarkers.push(nearbyMarker);
					}
				});
			}
		});
		nearbyMarkersInstance.current = nearbyMarkers;
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

				// clear the previous circles and markers if they exist
				if (greenCircleinstance.current?.getVisible()) {
					greenCircleinstance.current?.setVisible(false);
					redCircleinstance.current?.setVisible(false);
					nearbyMarkersInstance.current?.forEach((marker) => {
						marker.setVisible(false);
					});
				}
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

					// clear the previous circles and markers if they exist
					if (greenCircleinstance.current?.getVisible()) {
						greenCircleinstance.current?.setVisible(false);
						redCircleinstance.current?.setVisible(false);
						nearbyMarkersInstance.current?.forEach((marker) => {
							marker.setVisible(false);
						});
					}
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

				// clear the previous circles and markers if they exist
				if (greenCircleinstance.current?.getVisible()) {
					greenCircleinstance.current?.setVisible(false);
					redCircleinstance.current?.setVisible(false);
					nearbyMarkersInstance.current?.forEach((marker) => {
						marker.setVisible(false);
					});
				}
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
					// findNearbyPlaces(markerPosition);
					createCircles(markerPosition);
				}
			}
		}
	}, [count]);

	return <div ref={mapRef as LegacyRef<HTMLDivElement>} className='map' />;
};

export default Map;

//TODO:
// 3. dodaj funkcjonalność że do znacznika który jest najbliżej startowego znacznika wyświetlana jest odrazu droga.
// 4. dodaj możliwość kliknięcia na pozostałe znaczniki i wyświetlenia do nich drogi.
// 5. informacja o dokładnej odległości między zaznaczonymi znacznikami i czasie podróży.
// 6. zmodyfikuj działanie znaczników i obszarów, jeżeli w obszarze zielonym nie ma żadnych znaczników, to powinny się
// pojawić pozostałe znaczniki z obszaru czerwonego o ile takowe istnieja.
// 7. dodać dodatkowo clusterowanie znaczników, żeby rozdzielały się w grupy w zależności od ich ilości w danym miejscu.
// 8. poprawić mape bo jak się oddala na maxa to nie ma ograniczenia i mapa się spłaszcza i zostaja szare ramki do okoła.
// 9. poprawić i potweakować z wyszukiwaniem interesującyh nas miejsc w okół.
// 10. stworzyć możliwość wybierania kategorii miejsc które interesują użytkownika i zaadaptować logikę do tego.
// 11. ew. poprawić wyglad UI
