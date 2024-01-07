import { useRef, useState, useEffect } from 'react';
import './App.css';
import DropDownButton from 'src/Components/Dropdown/DropDownButton';
import Map from 'src/Components/Map/Map';
import AutoCompleteSearchBar from 'src/Components/AutoComplete/AutoCompleteSearchBar';
import SearchNearbyButton from 'src/Components/SearchNearby/SearchNearbyButton';
import ShowPlaceDetails from 'src/Components/ShowDetails/ShowPlaceDetails';
import DropDownCategoriesSearch from 'src/Components/Categories/DropDownCategoriesSearch';
import TransportationButton from 'src/Components/TransportMode/TransportButton';
import Help from 'src/Components/HelpCenter/Help';
import AreaButton from 'src/Components/AreaMode/AreaButton';
import Menu from 'src/Components/MenuList/Menu';
import Logo from 'src/assets/LogoMiasto15_v2.svg';
import Cookies from 'universal-cookie';
import NavigationButton from 'src/Components/Navigation/NavigationButton';

const cookies = new Cookies();

function App() {
	const [chosenCity, setChosenCity] = useState('');
	const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | undefined>(undefined);
	const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral>();
	const [count, setCount] = useState(0);
	const [categoriesTypes, setCategoriesTypes] = useState([]);
	const [initCategoriesForMenuList, setInitCategoriesForMenulist] = useState([]);
	const [showPlaceInfo, setShowPlaceInfo] = useState({
		name: '',
		formattedAddress: '',
		duration: '',
		distance: '',
	});
	const [activeTransportButton, setActiveTransportButton] = useState('walk');
	const [activeAreaButton, setActiveAreaButton] = useState('15');
	const [menuGrabberCategoriesList, setMenuGrabberCategoriesList] = useState({});
	const [directionsMenu, setDirectionsMenu] = useState<
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
	>({});
	const directionsRenderinstance = useRef<google.maps.DirectionsRenderer | null>(null);
	const [navigationLocationInfo, setNavigationLocationInfo] = useState<{
		startLocation?: google.maps.LatLng;
		endLocation?: google.maps.LatLng;
	}>({});

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const isMobile = windowWidth <= 1030;

	// for reading user geolocation
	useEffect(() => {
		// Check if the user's location is saved in the cookie
		const storedUserLocation = cookies.get('userLocation');

		if (storedUserLocation !== undefined) {
			setUserPosition(storedUserLocation);
		} else {
			// Ask for the user's geolocation only if the cookie is not available
			const getUserLocation = () => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;

						const location = { lat: latitude, lng: longitude };

						setUserPosition(location);

						cookies.set('userLocation', JSON.stringify(location), { path: '/', maxAge: 2592000 }); // maxAge is in seconds (30 days)
					},
					(error) => {
						console.error('Error getting user location:', error.message);
					}
				);
			};

			getUserLocation();
		}
	}, []);

	if (isMobile) {
		return (
			<div className='app'>
				<div className='side-bar'>
					<div className='logo'>
						<img src={Logo} alt='Logo' className='logo-sailor' />
					</div>
					<AutoCompleteSearchBar placeholder='Search address ...' setSelectedLocation={setSelectedLocation} />
					<SearchNearbyButton setCount={setCount} />
					<Menu
						setShowPlaceInfo={setShowPlaceInfo}
						initCategoriesForMenuList={initCategoriesForMenuList}
						menuGrabberCategoriesList={menuGrabberCategoriesList}
						directionsRenderinstance={directionsRenderinstance}
						directionsMenu={directionsMenu}
						setNavigationLocationInfo={setNavigationLocationInfo}
					/>
				</div>
				<div className='main-container'>
					<div className='dropdowns'>
						<div className='dropdown'>
							<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
						</div>
						<div className='dropdown'>
							<DropDownCategoriesSearch setCategoriesTypes={setCategoriesTypes} />
						</div>
					</div>
					<div className='map-container'>
						<Map
							userPosition={userPosition}
							chosenCity={chosenCity}
							setChosenCity={setChosenCity}
							selectedLocation={selectedLocation}
							count={count}
							setShowPlaceInfo={setShowPlaceInfo}
							categoriesTypes={categoriesTypes}
							setCategoriesTypes={setCategoriesTypes}
							setInitCategoriesForMenulist={setInitCategoriesForMenulist}
							activeTransportButton={activeTransportButton}
							activeAreaButton={activeAreaButton}
							setMenuGrabberCategoriesList={setMenuGrabberCategoriesList}
							directionsRenderinstance={directionsRenderinstance}
							setDirectionsMenu={setDirectionsMenu}
							setActiveTransportButton={setActiveTransportButton}
							setActiveAreaButton={setActiveAreaButton}
							setNavigationLocationInfo={setNavigationLocationInfo}
						/>
						<div className='over_map_transport'>
							<TransportationButton setActiveTransportButton={setActiveTransportButton} />
						</div>
						<div className='over_map_area'>
							<AreaButton setActiveAreaButton={setActiveAreaButton} />
						</div>
						<div className='over_map_navigation'>
							{navigationLocationInfo.startLocation && navigationLocationInfo.endLocation && (
								<NavigationButton
									navigationLocationInfo={navigationLocationInfo}
									activeTransportButton={activeTransportButton}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className='app'>
				<div className='side-bar'>
					<h1>15-Minute City</h1>
					<AutoCompleteSearchBar placeholder='Search address ...' setSelectedLocation={setSelectedLocation} />
					<SearchNearbyButton setCount={setCount} />
					<ShowPlaceDetails showPlaceInfo={showPlaceInfo} />
					{navigationLocationInfo.startLocation && navigationLocationInfo.endLocation && (
						<NavigationButton
							navigationLocationInfo={navigationLocationInfo}
							activeTransportButton={activeTransportButton}
						/>
					)}
				</div>
				<div className='main-container'>
					<Help />
					<div className='dropdowns'>
						<div className='dropdown'>
							<DropDownButton chosenCity={chosenCity} setChosenCity={setChosenCity} />
						</div>
						<div className='dropdown'>
							<DropDownCategoriesSearch setCategoriesTypes={setCategoriesTypes} />
						</div>
						<div className='menu'>
							<Menu
								setShowPlaceInfo={setShowPlaceInfo}
								initCategoriesForMenuList={initCategoriesForMenuList}
								menuGrabberCategoriesList={menuGrabberCategoriesList}
								directionsRenderinstance={directionsRenderinstance}
								directionsMenu={directionsMenu}
								setNavigationLocationInfo={setNavigationLocationInfo}
							/>
						</div>
					</div>
					<div className='map-container'>
						<Map
							userPosition={userPosition}
							setActiveTransportButton={setActiveTransportButton}
							setActiveAreaButton={setActiveAreaButton}
							chosenCity={chosenCity}
							setChosenCity={setChosenCity}
							selectedLocation={selectedLocation}
							count={count}
							setShowPlaceInfo={setShowPlaceInfo}
							categoriesTypes={categoriesTypes}
							setCategoriesTypes={setCategoriesTypes}
							setInitCategoriesForMenulist={setInitCategoriesForMenulist}
							activeTransportButton={activeTransportButton}
							activeAreaButton={activeAreaButton}
							setMenuGrabberCategoriesList={setMenuGrabberCategoriesList}
							directionsRenderinstance={directionsRenderinstance}
							setDirectionsMenu={setDirectionsMenu}
							setNavigationLocationInfo={setNavigationLocationInfo}
						/>
						<div className='over_map_transport'>
							<TransportationButton setActiveTransportButton={setActiveTransportButton} />
						</div>
						<div className='over_map_area'>
							<AreaButton setActiveAreaButton={setActiveAreaButton} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
