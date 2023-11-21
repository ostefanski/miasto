import './ShowPlaceDetails.css';

type ShowPlaceDetailsProps = {
	showPlaceInfo: {
		name: string;
		formattedAddress: string;
		duration: string;
		distance: string;
	};
};

const ShowPlaceDetails: React.FC<ShowPlaceDetailsProps> = ({ showPlaceInfo }) => {
	return (
		<div className='info'>
			<h2>Place Details</h2>
			<p>
				<b>Nazwa:</b> {showPlaceInfo.name}
			</p>
			<p>
				<b>Adres:</b> {showPlaceInfo.formattedAddress}
			</p>
			<p>
				<b>Czas podróży:</b> {showPlaceInfo.duration}
			</p>
			<p>
				<b>Odległość:</b> {showPlaceInfo.distance}
			</p>
		</div>
	);
};

export default ShowPlaceDetails;
