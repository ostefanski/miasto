import './Views.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackButton from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

type Anchor = 'right';

const VIEWS_STORAGE_KEY = 'savedViews';

interface SavedView {
	name: string;
	markersWithIcons: {
		marker: { lat: number; lng: number };
		originalIcon: string;
		place: google.maps.places.PlaceResult;
	}[];
}

function Views({ viewMarkersLocations, setSavedViewsInfo, setViewMarkersLocations, setShowPlaceInfo }) {
	const [state, setState] = React.useState({
		right: false,
	});

	const navigate = useNavigate();

	const [savedViews, setSavedViews] = useState<SavedView[]>([]);
	const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
	const [newViewName, setNewViewName] = useState<string>('');
	const [selectedViews, setSelectedViews] = useState<number[]>([]);

	useEffect(() => {
		// Retrieve saved views from local storage on component mount
		const savedViewsFromStorage = localStorage.getItem('savedViews');
		if (savedViewsFromStorage) {
			setSavedViews(JSON.parse(savedViewsFromStorage));
		}
	}, []);

	const handleViewClick = (clickedView: SavedView, event: React.MouseEvent) => {
		// Check if the click event target is the checkbox
		const isCheckboxClicked = (event.target as HTMLElement).tagName === 'INPUT';

		if (!isCheckboxClicked) {
			console.log('Clicked View:', clickedView);
			setSavedViewsInfo(clickedView); // keep a track of currently saved view markers locations
			setShowPlaceInfo({
				name: '',
				formattedAddress: '',
				duration: '',
				distance: '',
			});
			setViewMarkersLocations([]);
			navigate('/Views');
		}
	};

	const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const handleSaveView = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (viewMarkersLocations.length !== 0) {
			setDialogOpen(true);
		}
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setNewViewName('');
	};

	const handleSaveViewDialog = () => {
		if (newViewName.trim() !== '') {
			// Save the new view to local storage
			// Create a copy of viewMarkersLocations at the time of saving
			const currentMarkers = viewMarkersLocations.map((location) => ({
				marker: location.marker as google.maps.LatLng,
				originalIcon: location.originalIcon || '',
				place: location.place as google.maps.places.PlaceResult,
			}));

			const newView: SavedView = {
				name: newViewName,
				markersWithIcons: currentMarkers,
			};

			const updatedViews = [...savedViews, newView];
			localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(updatedViews));

			setSavedViews(updatedViews);
			handleCloseDialog();
		}
	};

	const handleNewViewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewViewName(event.target.value);
	};

	const handleCheckboxChange = (index: number) => {
		const isSelected = selectedViews.includes(index);
		if (isSelected) {
			setSelectedViews((prev) => prev.filter((item) => item !== index));
		} else {
			setSelectedViews((prev) => [...prev, index]);
		}
	};

	const handleDeleteViews = () => {
		// Delete selected views from local storage and update state
		const updatedViews = savedViews.filter((_, index) => !selectedViews.includes(index));
		localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(updatedViews));
		setSavedViews(updatedViews);
		setSelectedViews([]);
	};

	const list = (anchor: Anchor) => (
		<Box
			className='Views'
			role='presentation'
			style={{ width: '400px', display: 'flex', flexDirection: 'column', height: '100%' }}
		>
			<div className='header-views' onClick={toggleDrawer(anchor, false)}>
				<IconButton className='back-button'>
					<ArrowBackButton />
				</IconButton>
				<h3> Views </h3>
			</div>
			<Divider />
			<List style={{ flexGrow: 1, overflowY: 'auto' }}>
				{savedViews.map((view, index) => (
					<ListItem key={index} disablePadding>
						<ListItemButton onClick={(event) => handleViewClick(view, event)}>
							<ListItemText
								primary={
									<React.Fragment>
										<span style={{ color: '#90caf9', fontSize: '18px' }}>Name:</span> {view.name}
									</React.Fragment>
								}
								secondary={
									<React.Fragment>
										<span
											style={{
												color: 'gray',
												fontSize: '14px',
											}}
										>
											Date of creation:{' '}
											{new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
										</span>
									</React.Fragment>
								}
							/>
							<Checkbox checked={selectedViews.includes(index)} onChange={() => handleCheckboxChange(index)} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
			<div className='Buttons'>
				<Button onClick={handleSaveView} style={{ margin: '8px' }}>
					Save View
				</Button>
				<Button
					onClick={handleDeleteViews}
					disabled={selectedViews.length === 0}
					style={{ margin: '8px', color: selectedViews.length === 0 ? '' : 'red' }}
				>
					Delete
				</Button>
			</div>
			<Dialog open={isDialogOpen} onClose={handleCloseDialog} onClick={(event) => event.stopPropagation()}>
				<DialogTitle>Save New View</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						id='newViewName'
						label='View Name'
						type='text'
						fullWidth
						value={newViewName}
						onChange={handleNewViewNameChange}
						onKeyPress={(e) => {
							if (e.key === 'Enter' && newViewName.trim() !== '') {
								handleSaveViewDialog();
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSaveViewDialog} disabled={newViewName.trim() === ''}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);

	return (
		<div>
			{(['right'] as const).map((anchor) => (
				<React.Fragment key={anchor}>
					<div className='views-bt' onClick={toggleDrawer(anchor, true)}>
						<Tooltip title='Views'>
							<IconButton>
								<HistoryIcon
									style={{
										fontSize: '30px',
										color: 'black',
									}}
								/>
							</IconButton>
						</Tooltip>
					</div>
					<Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
						{list(anchor)}
					</Drawer>
				</React.Fragment>
			))}
		</div>
	);
}

export default Views;
