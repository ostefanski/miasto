import { LegacyRef, useEffect, useRef } from 'react';
import './Map.css';
import { initMap } from 'src/utils/GoogleApi';

type PlaceInfo = {
	name: string;
	formattedAddress: string;
	duration: string;
	distance: string;
};

type MapProps = {
	chosenCity: string;
	selectedLocation: google.maps.LatLng | undefined;
	count: number;
	setShowPlaceInfo: React.Dispatch<React.SetStateAction<PlaceInfo>>;
};

const Map: React.FC<MapProps> = ({ chosenCity, selectedLocation, count, setShowPlaceInfo }) => {
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

		const results: google.maps.places.PlaceResult[] = await new Promise((resolve) => {
			service.nearbySearch(request, (results, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK && results) {
					resolve(results);
				} else {
					resolve([]);
				}
			});
		});

		const nearbyMarkers: google.maps.Marker[] = [];
		const nearbyDurations: number[] = [];
		let nearestPlace: google.maps.places.PlaceResult | null = null;

		// Send the nearby search request

		for (const place of results) {
			if (place.geometry && place.geometry.location) {
				const duration = await calculateDuration(defaultLocation, place.geometry.location);
				const durationNumber = parseFloat(duration as string);

				nearbyDurations.push(durationNumber);

				if (!isNaN(durationNumber) && durationNumber <= 15) {
					const nearbyMarker = new google.maps.Marker({
						position: place.geometry.location,
						map: mapInstance.current,
						title: place.name,
						visible: true,
					});

					nearbyMarkers.push(nearbyMarker);

					google.maps.event.addListener(nearbyMarker, 'click', () => {
						clearDirections();
						CalculateAndDisplayDirections(defaultLocation, place.geometry?.location);
						fetchPlaceDetails(service, place.place_id ?? '');
					});
				}
			}
		}

		nearbyMarkersInstance.current = nearbyMarkers;

		const minDurationIndex = nearbyDurations.indexOf(Math.min(...nearbyDurations));
		if (minDurationIndex !== -1 && nearbyMarkers.length !== 0) {
			nearestPlace = results[minDurationIndex];
			CalculateAndDisplayDirections(defaultLocation, nearestPlace.geometry?.location);
			fetchPlaceDetails(service, nearestPlace.place_id ?? '');
		}
	};

	const fetchPlaceDetails = (service, placeId) => {
		const detailsRequest = {
			placeId: placeId,
			fields: ['name', 'formatted_address'],
		};

		// Send the PlaceDetails request
		service.getDetails(detailsRequest, (details, detailsStatus) => {
			if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && details) {
				setShowPlaceInfo((prevInfo) => ({
					...prevInfo,
					name: details.name,
					formattedAddress: details.formatted_address,
				}));
			} else {
				console.error('Error fetching place details:', detailsStatus);
			}
		});
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

				const route = response?.routes[0];

				const distance = route?.legs[0].distance?.text;
				const duration = route?.legs[0].duration?.text;

				if (distance && duration) {
					setShowPlaceInfo((prevInfo) => ({
						...prevInfo,
						duration: duration,
						distance: distance,
					}));
				}
			} else {
				console.error('Error while calculating directions', status);
			}
		});
	};

	const calculateDuration = (origin, destination) => {
		return new Promise((resolve, reject) => {
			const directionsService = new google.maps.DirectionsService();

			const request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.WALKING,
			};

			directionsService.route(request, (response, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					const route = response?.routes[0];
					const duration = route?.legs[0].duration?.text;
					resolve(duration);
				} else {
					console.error('Error while calculating duration', status);
					reject(status);
				}
			});
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

	const clearPlaceDetails = () => {
		setShowPlaceInfo((prevInfo) => ({
			...prevInfo,
			name: '',
			formattedAddress: '',
			duration: '',
			distance: '',
		}));
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
				clearCirclesandNearbyMarkers();
				markerInstance.current?.setVisible(false);
				clearPlaceDetails();
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
				// clear previous place details
				clearPlaceDetails();
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
					// clear previous place details
					clearPlaceDetails();
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
				// clear previous place details
				clearPlaceDetails();
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
// 9. poprawić i potweakować z wyszukiwaniem interesującyh nas miejsc w okół.
// 10. stworzyć możliwość wybierania kategorii miejsc które interesują użytkownika i zaadaptować logikę do tego.
// 11. ew. poprawić wyglad UI
