import { LegacyRef, MutableRefObject, SetStateAction, useEffect, useRef } from 'react';
import './Map.css';
import { initMap } from 'src/utils/GoogleApi';
import icons from 'src/assets/icons';

type PlaceInfo = {
	name: string;
	formattedAddress: string;
	duration: string;
	distance: string;
};

type MarkerInfo = {
	name: string | undefined;
	place: google.maps.places.PlaceResult;
	duration: number;
};

type MapProps = {
	chosenCity: string;
	selectedLocation: google.maps.LatLng | undefined;
	count: number;
	setShowPlaceInfo: React.Dispatch<React.SetStateAction<PlaceInfo>>;
	categoriesTypes: never[];
	setInitCategoriesForMenulist: React.Dispatch<SetStateAction<never[]>>;
	activeTransportButton: string;
	activeAreaButton: string;
	setMenuGrabberCategoriesList: React.Dispatch<React.SetStateAction<Record<string, MarkerInfo[]>>>;
	directionsRenderinstance: MutableRefObject<google.maps.DirectionsRenderer | null>;
	setDirectionsMenu: React.Dispatch<
		React.SetStateAction<
			Record<
				string,
				{
					direction: google.maps.DirectionsResult;
					name: string;
					distance: string;
					duration: string;
					formattedAddress: string;
				}[]
			>
		>
	>;
};

const Map: React.FC<MapProps> = ({
	chosenCity,
	selectedLocation,
	count,
	setShowPlaceInfo,
	categoriesTypes,
	setInitCategoriesForMenulist,
	activeTransportButton,
	activeAreaButton,
	setMenuGrabberCategoriesList,
	directionsRenderinstance,
	setDirectionsMenu,
}) => {

	// @@ interfejsy lepiej umieścić poza komponentem
	interface MarkerWithPlace {
		marker: google.maps.Marker;
		place: google.maps.places.PlaceResult;
		duration: number;
	}

	const mapRef = useRef<HTMLElement | null>(null);
	const mapInstance = useRef<google.maps.Map | null>(null);
	const markerInstance = useRef<google.maps.Marker | null>(null);
	const redCircleinstance = useRef<google.maps.Circle | null>(null);
	const greenCircleinstance = useRef<google.maps.Circle | null>(null);
	const nearbyMarkersInstance = useRef<MarkerWithPlace[] | null>(null);
	const previousMarkerInstancePosition = useRef<google.maps.LatLng | null | undefined>(null);
	// const directionsRenderinstance = useRef<google.maps.DirectionsRenderer | null>(null);
	const categoriesTypesInstance = useRef<never[] | null>(null);
	const transportationModeInstance = useRef<string>();
	const areaModeInstance = useRef<string>();

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

	const createCircles = async (defaultLocation, circleName: string) => {
		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		if (defaultLocation && circleName === 'greenwalk') {
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
		} else if (defaultLocation && circleName === 'redwalk') {
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
		} else if (defaultLocation && circleName === 'greenbike') {
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
				radius: 5000,
			});
		} else if (defaultLocation && circleName === 'redbike') {
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
				radius: 10000,
			});
		}
	};

	// Function to load an image asynchronously
	const loadImage = (url) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = (err) => reject(err);
			img.src = url;
		});
	};

	const findNearbyPlaces = async (defaultLocation) => {
		const types: string[] = categoriesTypes;
		categoriesTypesInstance.current = categoriesTypes;

		if (mapInstance.current === null) {
			console.error('Map is not initialized.');
			return;
		}

		// Create a PlacesService instance
		const service = new google.maps.places.PlacesService(mapInstance.current);

		const nearbyMarkers: MarkerWithPlace[] = [];

		const bikeRadiusValues = [2200, 5000, 10000]; // 2.2km, 5km, 10km

		// details grabber for the menu list of categories
		const nearbyMarkersInfoGrab: Record<string, MarkerInfo[]> = {
			university: [],
			bank: [],
			police: [],
			atm: [],
			bakery: [],
			bar: [],
			hair_care: [],
			cafe: [],
			church: [],
			shopping_mall: [],
			store: [],
			doctor: [],
			pharmacy: [],
			gas_station: [],
			gym: [],
			hardware_store: [],
			hospital: [],
			laundry: [],
			library: [],
			meal_delivery: [],
			movie_theater: [],
			night_club: [],
			park: [],
			parking: [],
			post_office: [],
			restaurant: [],
			school: [],
			stadium: [],
			supermarket: [],
			transit_station: [],
			veterinary_care: [],
			lodging: [],
			train_station: [],
			home_goods_store: [],
		};

		const categoriesInit: string[] = []; // array for storing static categories for menu list

		for (const type of types) {
			let results;

			categoriesInit.push(type);

			if (activeTransportButton === 'walk') {
				const requestWalk = {
					location: defaultLocation,
					radius: 2200, //2.2 km
					types: [type],
				};

				const resultsWalk: google.maps.places.PlaceResult[] = await new Promise((resolve) => {
					service.nearbySearch(requestWalk, (results, status) => {
						if (status === google.maps.places.PlacesServiceStatus.OK && results) {
							resolve(results);
						} else {
							resolve([]);
						}
					});
				});
				results = resultsWalk;
			} else if (activeTransportButton === 'bike') {
				const resultsBike = bikeRadiusValues.map(async (radius) => {
					const requestBike = {
						location: defaultLocation,
						radius,
						types: [type],
					};

					return new Promise((resolve) => {
						service.nearbySearch(requestBike, (results, status) => {
							if (status === google.maps.places.PlacesServiceStatus.OK && results) {
								resolve(results);
							} else {
								resolve([]);
							}
						});
					});
				});

				const resultsArrays = await Promise.all(resultsBike);
				const mergedResults = resultsArrays.flat(); // Merge results from different radius values

				// Filter out duplicate places based on place_id
				const uniqueResultsBike = mergedResults.filter(
					(place, index, self) =>
						index ===
						self.findIndex(
							(p) =>
								(p as google.maps.places.PlaceResult).place_id === (place as google.maps.places.PlaceResult).place_id
						)
				);

				results = uniqueResultsBike;
			}

			const durationPromises = (results as google.maps.places.PlaceResult[]).map(async (place) => {
				if (place.geometry && place.geometry.location) {
					const iconPath = icons[type];

					// Load the icon asynchronously
					const iconImage = await loadImage(iconPath);

					return calculateDuration(defaultLocation, place.geometry.location, activeTransportButton)
						.then((duration) => {
							const durationNumber = parseFloat(duration as string);

							const nearbyMarker = new google.maps.Marker({
								position: place.geometry?.location,
								map: mapInstance.current,
								icon: {
									url: (iconImage as HTMLImageElement).src,
									size: new google.maps.Size(24, 24),
								},
								title: place.name,
								visible: false,
							});

							nearbyMarkers.push({ marker: nearbyMarker, place, duration: durationNumber });

							nearbyMarkersInfoGrab[type].push({
								name: place.name,
								place,
								duration: durationNumber,
							});

							return durationNumber;
						})
						.catch((error) => {
							console.error('Error calculating duration:', error);
							return null;
						});
				}
				return Promise.resolve(null);
			});
			await Promise.all(durationPromises);
		}

		setInitCategoriesForMenulist(categoriesInit as never[]);

		nearbyMarkersInstance.current = nearbyMarkers;

		console.log(nearbyMarkers);

		const maxDuration = activeAreaButton === '15' ? 15 : 30;
		areaModeInstance.current = activeAreaButton;
		createCircles(
			defaultLocation,
			activeAreaButton === '15' ? `green${activeTransportButton}` : `red${activeTransportButton}`
		);

		nearbyMarkers.forEach((marker) => {
			if (!isNaN(marker.duration) && marker.duration <= maxDuration) {
				marker.marker.setVisible(true);
				const place = marker.place;

				google.maps.event.addListener(marker.marker, 'click', () => {
					clearDirections();
					CalculateAndDisplayDirections(defaultLocation, place.geometry?.location, activeTransportButton);
					fetchPlaceDetails(service, place.place_id ?? '');
				});
			}
		});

		// filtered list of lists of markers for each category for menu component
		const filteredMarkersInfoGrab: Record<string, MarkerInfo[]> = {};

		Object.entries(nearbyMarkersInfoGrab).forEach(([category, categoryMarkers]) => {
			const filteredMarkers = categoryMarkers.filter((marker) => {
				return !isNaN(marker.duration) && marker.duration <= maxDuration;
			});

			filteredMarkersInfoGrab[category] = filteredMarkers;
		});

		console.log(filteredMarkersInfoGrab);

		setMenuGrabberCategoriesList(filteredMarkersInfoGrab);

		// start of the logic for grabbing info about directions for each marker and info about markers
		// to make them being displayed on the website from the menu component by click
		const promises: Promise<{
			category: string;
			directions: {
				direction: google.maps.DirectionsResult;
				name: string;
				distance: string;
				duration: string;
				formattedAddress: string; // Include formattedAddress in the response
			}[];
		}>[] = [];

		Object.entries(filteredMarkersInfoGrab).forEach(([category, categoryMarkers]) => {
			const categoryPromise = Promise.all(
				categoryMarkers.map((marker) => {
					const place = marker.place;

					return CalculateDirectionsToDisplayByMenuComponent(
						defaultLocation,
						place.geometry?.location,
						activeTransportButton,
						service,
						place.place_id
					)
						.then((result) => ({
							direction: result.response as google.maps.DirectionsResult,
							name: marker.name,
							distance: result.distance,
							duration: result.duration,
							formattedAddress: result.formattedAddress,
						}))
						.catch((error) => {
							console.error('Error calculating directions:', error);
							return null;
						});
				})
			).then((directions) => ({
				category,
				directions: directions.filter((direction) => direction !== null) as {
					direction: google.maps.DirectionsResult;
					name: string;
					distance: string;
					duration: string;
					formattedAddress: string;
				}[],
			}));

			promises.push(categoryPromise);
		});

		Promise.all(promises).then((categoryResponses) => {
			const validResponses: Record<
				string,
				{
					direction: google.maps.DirectionsResult;
					name: string;
					distance: string;
					duration: string;
					formattedAddress: string;
				}[]
			> = {};
			categoryResponses.forEach(({ category, directions }) => {
				validResponses[category] = directions;
			});

			setDirectionsMenu(validResponses);
			console.log(validResponses);
		});

		// end of the logic for menu component
		let minDuration = Infinity;
		let minDurationIndex = -1;

		nearbyMarkers.forEach((marker, index) => {
			if (marker.duration <= maxDuration) {
				if (!isNaN(marker.duration) && marker.duration !== null && marker.duration < minDuration) {
					minDuration = marker.duration;
					minDurationIndex = index;
				}
			}
		});

		if (minDuration !== -1 && nearbyMarkers.length !== 0) {
			const nearestPlace = nearbyMarkers[minDurationIndex].place;
			CalculateAndDisplayDirections(defaultLocation, nearestPlace.geometry?.location, activeTransportButton);
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
				if (transportationModeInstance.current === 'bike' && areaModeInstance.current === '15') {
					mapInstance.current?.setZoom(13);
				} else if (transportationModeInstance.current === 'bike' && areaModeInstance.current === '30') {
					mapInstance.current?.setZoom(12);
				} else {
					mapInstance.current?.setZoom(15);
				}

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

	const CalculateDirectionsToDisplayByMenuComponent = (
		origin,
		destination,
		mode,
		service,
		placeId
	): Promise<{
		response: google.maps.DirectionsResult | null;
		distance: string | undefined;
		duration: string | undefined;
		formattedAddress: string | undefined; // Include formatted_address in the return type
	}> => {
		const directionsService = new google.maps.DirectionsService();

		const detailsRequest = {
			placeId: placeId,
			fields: ['formatted_address'],
		};

		return new Promise((resolve, reject) => {
			service.getDetails(detailsRequest, (details, detailsStatus) => {
				if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && details) {
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

					// Use DirectionsService to calculate directions
					directionsService.route(request, (response, status) => {
						if (status === google.maps.DirectionsStatus.OK && directionsRenderinstance.current) {
							const route = response?.routes[0];

							const distance = route?.legs[0].distance?.text;
							const duration = route?.legs[0].duration?.text;

							// Include formatted_address in the resolved object
							resolve({ response, distance, duration, formattedAddress: details.formatted_address });
						} else {
							console.error('Error while calculating directions', status);
							reject(new Error(`Error while calculating directions: ${status}`));
						}
					});
				} else {
					console.error('Error while getting place details', detailsStatus);
					reject(new Error(`Error while getting place details: ${detailsStatus}`));
				}
			});
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
		if (greenCircleinstance.current?.getVisible()) {
			greenCircleinstance.current?.setVisible(false);
			redCircleinstance.current?.setVisible(false);
			nearbyMarkersInstance.current?.forEach((marker) => {
				marker.marker.setVisible(false);
			});
		} else if (redCircleinstance.current?.getVisible()) {
			redCircleinstance.current?.setVisible(false);
			nearbyMarkersInstance.current?.forEach((marker) => {
				marker.marker.setVisible(false);
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
				setMenuGrabberCategoriesList({});
				setInitCategoriesForMenulist([]);

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
					setMenuGrabberCategoriesList({});
					setInitCategoriesForMenulist([]);
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
				setMenuGrabberCategoriesList({});
				setInitCategoriesForMenulist([]);
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
					setMenuGrabberCategoriesList({});
					setInitCategoriesForMenulist([]);
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
				setMenuGrabberCategoriesList({});
				setInitCategoriesForMenulist([]);
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
					if (
						categoriesTypes !== categoriesTypesInstance.current ||
						activeTransportButton !== transportationModeInstance.current ||
						activeAreaButton !== areaModeInstance.current
					) {
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
