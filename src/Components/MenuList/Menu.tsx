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
import './Menu.css';
import { School, AttachMoney, LocalPolice, Atm } from '@mui/icons-material';

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
];

type Anchor = 'right';

function Menu({ initCategoriesForMenuList, menuGrabberCategoriesList }) {
	const [state, setState] = React.useState({
		right: false,
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

	const list = (anchor: Anchor) => (
		<Box
			className='Menu'
			role='presentation'
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<h3>Wyświetlone miejsca</h3>
			<Divider />
			<List>
				{initCategoriesForMenuList.map((category) => {
					const matchedCategory = categoryList.find((item) => item.text === category);
					const categoryMarkers = menuGrabberCategoriesList[category] || [];
					return (
						<React.Fragment key={category}>
							<ListItem disablePadding>
								<ListItemButton>
									{matchedCategory && <ListItemIcon>{matchedCategory.icon}</ListItemIcon>}
									<ListItemText primary={category} />
								</ListItemButton>
							</ListItem>
							{categoryMarkers &&
								categoryMarkers.map((marker, index) => (
									<ListItem key={index}>
										<ListItemText primary={marker.name} secondary={`Duration: ${marker.duration} min`} />
									</ListItem>
								))}
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
								<MenuIcon style={{ fontSize: '30px', color: 'black' }} />
							</IconButton>
						</Tooltip>
					</div>
					<Drawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
						PaperProps={{ style: { width: 400 } }}
					>
						{list(anchor)}
					</Drawer>
				</React.Fragment>
			))}
		</div>
	);
}

export default Menu;
