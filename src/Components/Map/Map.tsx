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
	categoriesTypes: never[];
	activeTransportButton: string;
};

const Map: React.FC<MapProps> = ({
	chosenCity,
	selectedLocation,
	count,
	setShowPlaceInfo,
	categoriesTypes,
	activeTransportButton,
}) => {
	const mapRef = useRef<HTMLElement | null>(null);
	const mapInstance = useRef<google.maps.Map | null>(null);
	const markerInstance = useRef<google.maps.Marker | null>(null);
	const redCircleinstance = useRef<google.maps.Circle | null>(null);
	const greenCircleinstance = useRef<google.maps.Circle | null>(null);
	const nearbyMarkersInstance = useRef<google.maps.Marker[] | null>(null);
	const previousMarkerInstancePosition = useRef<google.maps.LatLng | null | undefined>(null);
	const directionsRenderinstance = useRef<google.maps.DirectionsRenderer | null>(null);
	const categoriesTypesInstance = useRef<never[] | null>(null);
	const transportationModeInstance = useRef<string>();

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

	const createCircles = async (defaultLocation, bool) => {
		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		if (defaultLocation && bool === true) {
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
		} else if (defaultLocation && bool === false) {
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
		}
	};

	const findNearbyPlaces = async (defaultLocation) => {
		// const types = ['university', 'bank']; // 'hospital', , 'bus_station', 'police', 'doctor', 'school', 'bank', 'store'

		const types = categoriesTypes;
		categoriesTypesInstance.current = categoriesTypes;

		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		// Create a PlacesService instance
		const service = new google.maps.places.PlacesService(mapInstance.current);

		const nearbyMarkers: google.maps.Marker[] = [];

		const durationPromises: Promise<number | null>[] = [];

		const durationPromisesRedCircle: Promise<number | null>[] = [];

		let createGreenAndRedCircles = false;

		const allResults: google.maps.places.PlaceResult[] = [];

		const allResultsRedCircle: google.maps.places.PlaceResult[] = [];

		for (const type of types) {
			// Define the request parameters
			const request = {
				location: defaultLocation,
				radius: 1100, // 1.1 km
				types: [type],
			};

			//Define request for redCircle
			const requestRedCircle = {
				location: defaultLocation,
				radius: 2200,
				types: [type],
			};

			// google.maps.places.PlaceResult[]
			const results: google.maps.places.PlaceResult[] = await new Promise((resolve) => {
				service.nearbySearch(request, (results, status) => {
					if (status === google.maps.places.PlacesServiceStatus.OK && results) {
						resolve(results);
					} else {
						resolve([]);
					}
				});
			});

			const resultsRedCircle: google.maps.places.PlaceResult[] = await new Promise((resolve) => {
				service.nearbySearch(requestRedCircle, (resultsRedCircle, status) => {
					if (status === google.maps.places.PlacesServiceStatus.OK && resultsRedCircle) {
						resolve(resultsRedCircle);
					} else {
						resolve([]);
					}
				});
			});

			allResults.push(...results);

			allResultsRedCircle.push(...resultsRedCircle);

			let checkIfGreenCircleEmptyOfMarkers = true;

			// Send the nearby search request

			const resultsPromises = results.map((place) => {
				if (place.geometry && place.geometry.location) {
					const durationPromise = calculateDuration(defaultLocation, place.geometry.location, activeTransportButton)
						.then((duration) => {
							const durationNumber = parseFloat(duration as string);

							if (!isNaN(durationNumber) && durationNumber <= 15) {
								const nearbyMarker = new google.maps.Marker({
									position: place.geometry?.location,
									map: mapInstance.current,
									title: place.name,
									visible: true,
								});

								google.maps.event.addListener(nearbyMarker, 'click', () => {
									clearDirections();
									CalculateAndDisplayDirections(defaultLocation, place.geometry?.location, activeTransportButton);
									fetchPlaceDetails(service, place.place_id ?? '');
								});

								nearbyMarkers.push(nearbyMarker);
								createGreenAndRedCircles = true; // Mark that the green and red circle is created
								checkIfGreenCircleEmptyOfMarkers = false; // the green circle for some type of place has markers below 15min
							}

							return durationNumber;
						})
						.catch((error) => {
							console.error('Error calculating duration:', error);
							return null;
						});

					durationPromises.push(durationPromise);
					return durationPromise; // Return the duration promise for this place
				}
				return Promise.resolve(null); // Placeholder promise for places without geometry
			});

			await Promise.all(resultsPromises); // Wait for all promises from the results block to resolve

			if (checkIfGreenCircleEmptyOfMarkers === true) {
				resultsRedCircle.forEach((place) => {
					if (place.geometry && place.geometry.location) {
						const durationPromise = calculateDuration(defaultLocation, place.geometry.location, activeTransportButton)
							.then((duration) => {
								const durationNumber = parseFloat(duration as string);

								if (!isNaN(durationNumber) && durationNumber > 15 && durationNumber <= 30) {
									const nearbyMarker = new google.maps.Marker({
										position: place.geometry?.location,
										map: mapInstance.current,
										title: place.name,
										visible: true,
									});

									google.maps.event.addListener(nearbyMarker, 'click', () => {
										clearDirections();
										CalculateAndDisplayDirections(defaultLocation, place.geometry?.location, activeTransportButton);
										fetchPlaceDetails(service, place.place_id ?? '');
									});

									nearbyMarkers.push(nearbyMarker);
								}

								return durationNumber;
							})
							.catch((error) => {
								console.error('Error calculating duration:', error);
								return null;
							});

						durationPromisesRedCircle.push(durationPromise);
					}
				});
			}
		}

		const [nearbyDurations, nearbyRedCircleDurations] = await Promise.all([
			Promise.all(durationPromises),
			Promise.all(durationPromisesRedCircle),
		]);

		nearbyMarkersInstance.current = nearbyMarkers;

		if (createGreenAndRedCircles) {
			if (nearbyRedCircleDurations && nearbyDurations) {
				// create green and red circles
				createCircles(markerInstance.current?.getPosition(), false);

				const minDurationIndex = nearbyDurations.indexOf(
					Math.min(...(nearbyDurations.filter((duration) => duration !== null) as number[]))
				);

				if (minDurationIndex !== -1 && nearbyMarkers.length !== 0) {
					const nearestPlace = allResults[minDurationIndex];
					CalculateAndDisplayDirections(defaultLocation, nearestPlace.geometry?.location, activeTransportButton);
					fetchPlaceDetails(service, nearestPlace.place_id ?? '');
				}
			}
		} else {
			// create only red circle
			createCircles(markerInstance.current?.getPosition(), true);

			const minDurationIndex = nearbyRedCircleDurations.indexOf(
				Math.min(...(nearbyRedCircleDurations.filter((duration) => duration !== null) as number[]))
			);

			if (minDurationIndex !== -1 && nearbyMarkers.length !== 0) {
				const nearestPlace = allResultsRedCircle[minDurationIndex];
				CalculateAndDisplayDirections(defaultLocation, nearestPlace.geometry?.location, activeTransportButton);
				fetchPlaceDetails(service, nearestPlace.place_id ?? '');
			}
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

	const CalculateAndDisplayDirections = (origin, destination, mode) => {
		const directionsService = new google.maps.DirectionsService();

		if (directionsRenderinstance.current === null) {
			directionsRenderinstance.current = new google.maps.DirectionsRenderer({
				preserveViewport: true,
			});
		}

		directionsRenderinstance.current.setOptions({
			suppressMarkers: true,
			polylineOptions: {
				zIndex: 50,
				strokeColor: '#1976D2',
				strokeWeight: 5,
			},
		});

		directionsRenderinstance.current.setMap(mapInstance.current);

		let request;

		if (mode === 'walk') {
			request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.WALKING,
			};
		} else if (mode === 'bike') {
			request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.BICYCLING,
			};
		}

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

	const calculateDuration = (origin, destination, mode) => {
		return new Promise((resolve, reject) => {
			const directionsService = new google.maps.DirectionsService();

			let request;

			if (mode === 'walk') {
				transportationModeInstance.current = mode;
				request = {
					origin: origin,
					destination: destination,
					travelMode: google.maps.TravelMode.WALKING,
				};
			} else if (mode === 'bike') {
				transportationModeInstance.current = mode;
				request = {
					origin: origin,
					destination: destination,
					travelMode: google.maps.TravelMode.BICYCLING,
				};
			}

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
		if (greenCircleinstance.current?.getVisible() && redCircleinstance.current?.getVisible()) {
			greenCircleinstance.current?.setVisible(false);
			redCircleinstance.current?.setVisible(false);
			nearbyMarkersInstance.current?.forEach((marker) => {
				marker.setVisible(false);
			});
		} else if (redCircleinstance.current?.getVisible()) {
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
				draggable: true,
			});

			let isMarkerBeingDragged = false;

			markerInstance.current.addListener('dragstart', () => {
				isMarkerBeingDragged = true;
			});

			markerInstance.current.addListener('dragend', () => {
				isMarkerBeingDragged = false;

				clearDirections();
				clearCirclesandNearbyMarkers();
				clearPlaceDetails();

				const draggedLocation = markerInstance.current?.getPosition();

				if (draggedLocation) {
					mapInstance.current?.panTo(draggedLocation);
					mapInstance.current?.setZoom(12);
				}
			});

			markerInstance.current.addListener('click', () => {
				if (!isMarkerBeingDragged) {
					clearDirections();
					clearCirclesandNearbyMarkers();
					markerInstance.current?.setVisible(false);
					clearPlaceDetails();
				}
			});

			mapInstance.current.addListener('click', (event) => {
				const clickedLocation = event.latLng;
				markerInstance.current?.setPosition(clickedLocation);
				markerInstance.current?.setVisible(true);
				mapInstance.current?.panTo(clickedLocation);
				mapInstance.current?.setZoom(12);

				clearDirections();
				clearCirclesandNearbyMarkers();
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

					clearDirections();
					clearCirclesandNearbyMarkers();
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

				clearDirections();
				clearCirclesandNearbyMarkers();
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
					// createCircles(markerPosition);
					mapInstance.current.setZoom(14);
				} else {
					if (categoriesTypes !== categoriesTypesInstance.current) {
						clearDirections();
						clearCirclesandNearbyMarkers();
						clearPlaceDetails();
						findNearbyPlaces(markerPosition);
					}
					if (activeTransportButton !== transportationModeInstance.current) {
						clearDirections();
						clearCirclesandNearbyMarkers();
						clearPlaceDetails();
						findNearbyPlaces(markerPosition);
					}
				}
			}
		}
	}, [count]);

	return <div ref={mapRef as LegacyRef<HTMLDivElement>} className='map'></div>;
};

export default Map;

//TODO:
// 6. zmodyfikuj działanie znaczników i obszarów, jeżeli w obszarze zielonym nie ma żadnych znaczników, to powinny się
// pojawić pozostałe znaczniki z obszaru czerwonego o ile takowe istnieja.
// 11. ew. poprawić wyglad UI
