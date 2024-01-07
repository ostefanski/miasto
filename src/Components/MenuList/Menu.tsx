import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import ArrowBackButton from '@mui/icons-material/ArrowBack';
import './Menu.css';
import {
	School,
	AttachMoney,
	LocalPolice,
	Atm,
	BakeryDining,
	LocalBar,
	Carpenter,
	LocalCafe,
	Church,
	LocalMall,
	ShoppingCart,
	AccountCircle,
	LocalPharmacy,
	LocalGasStation,
	FitnessCenter,
	Store,
	LocalHospital,
	LocalLaundryService,
	LocalLibrary,
	DeliveryDining,
	Movie,
	Nightlife,
	Park,
	LocalParking,
	LocalPostOffice,
	Restaurant,
	Stadium,
	LocalGroceryStore,
	DirectionsBus,
	Hotel,
	DirectionsRailway,
} from '@mui/icons-material';
import { MutableRefObject, useState } from 'react';
import Help from 'src/Components/HelpCenter/Help';

const categoryList = [
	{
		text: 'university',
		icon: <School />,
	},
	{
		text: 'bank',
		icon: <AttachMoney />,
	},
	{
		text: 'police',
		icon: <LocalPolice />,
	},
	{
		text: 'atm',
		icon: <Atm />,
	},
	{
		text: 'bakery',
		icon: <BakeryDining />,
	},

	{
		text: 'bar',
		icon: <LocalBar />,
	},

	{
		text: 'hair_care',
		icon: <Carpenter />,
	},

	{
		text: 'cafe',
		icon: <LocalCafe />,
	},

	{
		text: 'church',
		icon: <Church />,
	},

	{
		text: 'shopping_mall',
		icon: <LocalMall />,
	},

	{
		text: 'store',
		icon: <ShoppingCart />,
	},

	{
		text: 'doctor',
		icon: <AccountCircle />,
	},

	{
		text: 'pharmacy',
		icon: <LocalPharmacy />,
	},

	{
		text: 'gas_station',
		icon: <LocalGasStation />,
	},

	{
		text: 'gym',
		icon: <FitnessCenter />,
	},

	{
		text: 'hardware_store',
		icon: <Store />,
	},

	{
		text: 'hospital',
		icon: <LocalHospital />,
	},

	{
		text: 'laundry',
		icon: <LocalLaundryService />,
	},

	{
		text: 'library',
		icon: <LocalLibrary />,
	},

	{
		text: 'meal_delivery',
		icon: <DeliveryDining />,
	},

	{
		text: 'movie_theater',
		icon: <Movie />,
	},

	{
		text: 'night_club',
		icon: <Nightlife />,
	},

	{
		text: 'park',
		icon: <Park />,
	},

	{
		text: 'parking',
		icon: <LocalParking />,
	},

	{
		text: 'post_office',
		icon: <LocalPostOffice />,
	},

	{
		text: 'restaurant',
		icon: <Restaurant />,
	},

	{
		text: 'school',
		icon: <School />,
	},

	{
		text: 'stadium',
		icon: <Stadium />,
	},

	{
		text: 'supermarket',
		icon: <LocalGroceryStore />,
	},

	{
		text: 'transit_station',
		icon: <DirectionsBus />,
	},

	{
		text: 'veterinary_care',
		icon: <LocalHospital />,
	},

	{
		text: 'lodging',
		icon: <Hotel />,
	},

	{
		text: 'train_station',
		icon: <DirectionsRailway />,
	},

	{
		text: 'home_goods_store',
		icon: <Store />,
	},
];

type Anchor = 'right';

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

type MenuProps = {
	initCategoriesForMenuList: string[];
	menuGrabberCategoriesList: Record<string, MarkerInfo[]>;
	directionsRenderinstance: MutableRefObject<google.maps.DirectionsRenderer | null>;
	directionsMenu: Record<
		string,
		{
			direction: google.maps.DirectionsResult;
			name: string;
			distance: string;
			duration: string;
			formattedAddress: string;
			startLocation?: google.maps.LatLng;
			endLocation?: google.maps.LatLng;
		}[]
	>;
	setShowPlaceInfo: React.Dispatch<React.SetStateAction<PlaceInfo>>;
	setNavigationLocationInfo: React.Dispatch<
		React.SetStateAction<{
			startLocation?: google.maps.LatLng;
			endLocation?: google.maps.LatLng;
		}>
	>;
};

function Menu({
	initCategoriesForMenuList,
	menuGrabberCategoriesList,
	directionsRenderinstance,
	directionsMenu,
	setShowPlaceInfo,
	setNavigationLocationInfo,
}: MenuProps) {
	const [state, setState] = useState({
		right: false,
	});

	const [stateCategory, setStateCategory] = useState({
		right: false,
		categoryOpen: {}, // Maintain a state for category expansion
	});

	const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const toggleCategory = (category: string) => {
		setStateCategory((prevState) => ({
			...prevState,
			categoryOpen: {
				...prevState.categoryOpen,
				[category]: !prevState.categoryOpen[category],
			},
		}));
	};

	let isMobile = false;
	if (window.innerWidth <= 1030) {
		isMobile = true;
	}

	const list = (anchor: Anchor) => (
		<Box className='Menu' role='presentation' onKeyDown={toggleDrawer(anchor, false)}>
			<div className='header'>
				<IconButton className='back-button' onClick={toggleDrawer(anchor, false)}>
					<ArrowBackButton />
				</IconButton>
				<h3> Places </h3>
				{isMobile && (
					<div className='help-mobile'>
						<Help />
					</div>
				)}
			</div>
			<Divider />
			<List className='list'>
				{initCategoriesForMenuList.map((category) => {
					const matchedCategory = categoryList.find((item) => item.text === category);
					const categoryMarkers = menuGrabberCategoriesList[category] || [];
					const sortedCategoryMarkers = [...categoryMarkers].sort((a, b) => a.duration - b.duration);
					return (
						<React.Fragment key={category}>
							<ListItem disablePadding>
								<ListItemButton onClick={() => toggleCategory(category)}>
									{matchedCategory && <ListItemIcon>{matchedCategory.icon}</ListItemIcon>}
									<ListItemText
										primary={
											<>
												{category.charAt(0).toUpperCase() + category.slice(1)}
												<span
													style={{
														color: 'gray',
														marginLeft: '15px',
														fontSize: '14px',
													}}
												>
													results: {categoryMarkers.length}
												</span>
											</>
										}
									/>
								</ListItemButton>
							</ListItem>
							<Collapse in={stateCategory.categoryOpen[category]} timeout='auto' unmountOnExit>
								{/* Expandable content */}
								<List component='div' disablePadding>
									{sortedCategoryMarkers.map((marker, index) => (
										<ListItem className='items' key={index}>
											<ListItemText
												className='items_text'
												primary={marker.name}
												secondary={`duration: ${marker.duration} min`}
												onClick={() => {
													setState((prevState) => ({
														...prevState,
														right: false,
													}));
													const categoryDirections = directionsMenu[category];
													const selectedDirection = categoryDirections.find(
														(direction) => direction.name === marker.name
													);

													if (selectedDirection) {
														setShowPlaceInfo((prevInfo) => ({
															...prevInfo,
															name: selectedDirection.name,
															formattedAddress: selectedDirection.formattedAddress,
															duration: selectedDirection.duration,
															distance: selectedDirection.distance,
														}));
													}

													if (selectedDirection) {
														directionsRenderinstance.current?.setDirections(selectedDirection.direction);
														setNavigationLocationInfo({
															startLocation: selectedDirection.startLocation,
															endLocation: selectedDirection.endLocation,
														});
													}
												}}
											/>
										</ListItem>
									))}
								</List>
							</Collapse>
							<Divider />
						</React.Fragment>
					);
				})}
			</List>
		</Box>
	);

	return (
		<div>
			{(['right'] as const).map((anchor) => (
				<React.Fragment key={anchor}>
					<div className='button' onClick={toggleDrawer(anchor, true)}>
						<Tooltip title='Menu'>
							<IconButton>
								<MenuIcon
									style={{
										fontSize: '30px',
										color: isMobile ? '#c7edef' : 'black',
									}}
								/>
							</IconButton>
						</Tooltip>
					</div>
					<Drawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
						// PaperProps={{ style: { width: 400 } }}
					>
						{list(anchor)}
					</Drawer>
				</React.Fragment>
			))}
		</div>
	);
}

export default Menu;
