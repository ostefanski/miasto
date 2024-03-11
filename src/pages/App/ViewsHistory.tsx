import './ViewsHistory.css';
import MapView from 'src/Components/MapView/MapView';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function ViewsHistory({ savedViewsInfo }) {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/');
	};

	return (
		<div className='main-view'>
			<div className='side-bar'>
				<div className='back-home'>
					<ArrowBackIcon fontSize='large' onClick={handleBack} style={{ cursor: 'pointer' }} />
					<h3>Go back to Home Page</h3>
				</div>
			</div>
			{savedViewsInfo ? (
				<div className='main-container-view'>
					<h1>Your Saved View</h1>
					<p>View Name: {savedViewsInfo.name}</p>
					<div className='map-container'>
						<MapView savedViewsInfo={savedViewsInfo} />
					</div>
				</div>
			) : (
				<p>No view markers locations available.</p>
			)}
		</div>
	);
}

export default ViewsHistory;
