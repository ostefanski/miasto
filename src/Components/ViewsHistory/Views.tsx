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
import { useEffect } from 'react';

type Anchor = 'right';

const VIEWS_STORAGE_KEY = 'savedViews';

interface SavedView {
	name: string;
	markers: { lat: number; lng: number }[];
}

function Views({ viewMarkersLocations, setSavedViewsInfo }) {
	const [state, setState] = React.useState({
		right: false,
	});

	const navigate = useNavigate();

	const [savedViews, setSavedViews] = React.useState<SavedView[]>([]);
	const [isDialogOpen, setDialogOpen] = React.useState<boolean>(false);
	const [newViewName, setNewViewName] = React.useState<string>('');

	useEffect(() => {
		// Retrieve saved views from local storage on component mount
		const savedViewsFromStorage = localStorage.getItem('savedViews');
		if (savedViewsFromStorage) {
			setSavedViews(JSON.parse(savedViewsFromStorage));
		}
	}, []);

	const handleViewClick = (clickedView: SavedView) => {
		console.log('Clicked View:', clickedView);
		setSavedViewsInfo(clickedView); // keep a track of currently saved view markers locations
		navigate('/Views');
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
			const currentMarkers = [...viewMarkersLocations];
			const newView = {
				name: newViewName,
				markers: currentMarkers.map((latLng) => ({
					lat: latLng.lat(),
					lng: latLng.lng(),
				})),
			};

			localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify([...savedViews, newView]));

			setSavedViews((prevViews) => [...prevViews, newView]);
			handleCloseDialog();
		}
	};

	const handleNewViewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewViewName(event.target.value);
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
						<ListItemButton onClick={() => handleViewClick(view)}>
							<ListItemText primary={view.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
			<Button onClick={handleSaveView} style={{ margin: '8px' }}>
				Save View
			</Button>

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
