import './ViewsHistory.css';
import MapView from 'src/Components/MapView/MapView';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TransportationButton from 'src/Components/TransportMode/TransportButton';
import ShowPlaceDetails from 'src/Components/ShowDetails/ShowPlaceDetails';

function ViewsHistory({
	savedViewsInfo,
	setActiveTransportButton,
	showPlaceInfo,
	setShowPlaceInfo,
	activeTransportButton,
}) {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/');
	};

	return (
		<div className='main-view'>
			<div className='side-bar'>
				<div className='back-home'>
					<Tooltip title='Home'>
						<IconButton onClick={handleBack}>
							<ArrowBackIcon fontSize='large' style={{ cursor: 'pointer', color: 'white' }} />
						</IconButton>
					</Tooltip>
					<h3>Go back to Home Page</h3>
				</div>
				<ShowPlaceDetails showPlaceInfo={showPlaceInfo} />
			</div>
			{savedViewsInfo ? (
				<div className='main-container-view'>
					<h1>Your Saved View</h1>
					<p>View Name: {savedViewsInfo.name}</p>
					<div className='map-container'>
						<MapView
							activeTransportButton={activeTransportButton}
							savedViewsInfo={savedViewsInfo}
							setShowPlaceInfo={setShowPlaceInfo}
						/>
						<div className='over_map_transport'>
							<TransportationButton setActiveTransportButton={setActiveTransportButton} />
						</div>
					</div>
				</div>
			) : (
				<p>No view markers locations available.</p>
			)}
		</div>
	);
}

export default ViewsHistory;
