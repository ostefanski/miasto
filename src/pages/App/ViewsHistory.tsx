import './ViewsHistory.css';
import MapView from 'src/Components/MapView/MapView';

function ViewsHistory({ savedViewsInfo }) {
	return (
		<div className='main-view'>
			<h1>Your Saved View</h1>
			{savedViewsInfo ? (
				<div className='map-view-container'>
					<p>View Name: {savedViewsInfo.name}</p>
					<MapView savedViewsInfo={savedViewsInfo} />
				</div>
			) : (
				<p>No view markers locations available.</p>
			)}
		</div>
	);
}

export default ViewsHistory;
