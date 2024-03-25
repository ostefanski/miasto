import { useEffect, useRef, useState } from 'react';
import { initMap } from 'src/utils/GoogleApi';

interface SavedView {
	name: string;
	markersWithIcons: {
		marker: { lat: number; lng: number };
		originalIcon: string;
		place: google.maps.places.PlaceResult;
	}[];
}

type PlaceInfo = {
	name: string;
	formattedAddress: string;
	duration: string;
	distance: string;
};

function MapView({
	savedViewsInfo,
	setShowPlaceInfo,
	activeTransportButton,
}: {
	savedViewsInfo: SavedView;
	setShowPlaceInfo: React.Dispatch<React.SetStateAction<PlaceInfo>>;
	activeTransportButton: string;
}) {
	const mapRef = useRef(null);
	const mapInstance = useRef<google.maps.Map | null>(null);
	const markerInstance = useRef<google.maps.Marker | null>(null);
	const directionsRenderinstance = useRef<google.maps.DirectionsRenderer | null>(null);
	const activeTransportButtonRef = useRef(activeTransportButton);
	const [currentOrigin, setCurrentOrigin] = useState(null);
	const [currentDestination, setCurrentDestination] = useState(null);

	const initializeMap = async () => {
		if (mapRef.current && savedViewsInfo.markersWithIcons && savedViewsInfo.markersWithIcons.length > 0) {
			mapInstance.current = await initMap(mapRef.current, savedViewsInfo.markersWithIcons[0].marker);

			// Create a PlacesService instance
			const service = new google.maps.places.PlacesService(mapInstance.current);

			savedViewsInfo.markersWithIcons.forEach(({ marker, originalIcon, place }) => {
				const initializedMarker = new google.maps.Marker({
					position: marker,
					map: mapInstance.current,
					icon: originalIcon,
				});

				initializedMarker.addListener('click', () => {
					if (markerInstance.current && markerInstance.current.getVisible()) {
						const defaultMarkerPosition = markerInstance.current.getPosition();
						CalculateAndDisplayDirections(defaultMarkerPosition, place.geometry?.location);
						fetchPlaceDetails(service, place.place_id);
					} else {
						fetchPlaceDetails(service, place.place_id);
					}
				});
			});

			const blueMarkerIcon = {
				url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
			};

			markerInstance.current = new google.maps.Marker({
				position: savedViewsInfo.markersWithIcons[0].marker,
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
				clearPlaceDetails();
				clearOriginAndDestination();

				const draggedLocation = markerInstance.current?.getPosition();

				if (draggedLocation) {
					mapInstance.current?.panTo(draggedLocation);
					mapInstance.current?.setZoom(12);
				}
			});

			markerInstance.current.addListener('click', () => {
				if (!isMarkerBeingDragged) {
					clearDirections();
					clearPlaceDetails();
					clearOriginAndDestination();
					markerInstance.current?.setVisible(false);
				}
			});

			mapInstance.current.addListener('click', (event) => {
				const clickedLocation = event.latLng;
				markerInstance.current?.setPosition(clickedLocation);
				markerInstance.current?.setVisible(true);
				mapInstance.current?.panTo(clickedLocation);
				mapInstance.current?.setZoom(12);
				clearDirections();
				clearPlaceDetails();
				clearOriginAndDestination();
			});
		}
	};

	const CalculateAndDisplayDirections = (origin, destination) => {
		const mode = activeTransportButtonRef.current;
		setCurrentOrigin(origin);
		setCurrentDestination(destination);
		console.log('Selected mode:', mode);
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
			console.log('walking');
			request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.WALKING,
			};
		} else if (mode === 'bike') {
			console.log('biking');
			request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.BICYCLING,
			};
		}

		directionsService.route(request, (response, status) => {
			if (status === google.maps.DirectionsStatus.OK && directionsRenderinstance.current) {
				if (mode === 'bike') {
					mapInstance.current?.setZoom(13);
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

	const clearDirections = () => {
		if (directionsRenderinstance.current !== null) {
			console.log('cleared');
			directionsRenderinstance.current.setMap(null); // detach directions from the map
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

	const clearOriginAndDestination = () => {
		setCurrentOrigin(null);
		setCurrentDestination(null);
	};

	useEffect(() => {
		if (mapInstance.current === null) {
			initializeMap();
		}
	}, [savedViewsInfo]);

	useEffect(() => {
		activeTransportButtonRef.current = activeTransportButton;
	}, [activeTransportButton]);

	useEffect(() => {
		if (currentOrigin && currentDestination) {
			CalculateAndDisplayDirections(currentOrigin, currentDestination);
		}
	}, [activeTransportButton]);

	return <div ref={mapRef} style={{ height: '80vh', width: '80%' }} className='map-view'></div>;
}

export default MapView;
