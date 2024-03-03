import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import './NavigationButton.css';
import NavigationIcon from '@mui/icons-material/Navigation';

type NavigationButtonProps = {
	navigationLocationInfo: {
		startLocation?: google.maps.LatLng | undefined;
		endLocation?: google.maps.LatLng | undefined;
	};
	activeTransportButton: string;
};

function NavigationButton({ navigationLocationInfo, activeTransportButton }: NavigationButtonProps) {
	const handleButtonClick = () => {
		if (navigationLocationInfo.startLocation && navigationLocationInfo.endLocation) {
			const startLatitude = navigationLocationInfo.startLocation.lat();
			const startLongitude = navigationLocationInfo.startLocation.lng();

			const endLatitude = navigationLocationInfo.endLocation.lat();
			const endLongitude = navigationLocationInfo.endLocation.lng();

			const travelMode =
				activeTransportButton === 'walk' ? 'walking' : activeTransportButton === 'bike' ? 'bicycling' : '';

			const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
				`${startLatitude},${startLongitude}`
			)}&destination=${encodeURIComponent(
				`${endLatitude},${endLongitude}`
			)}&travelmode=${travelMode}&dir_action=navigate`;

			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

			if (isMobile) {
				// Open in Google Maps app
				window.location.href = `comgooglemaps://?saddr=${startLatitude},${startLongitude}&daddr=${endLatitude},${endLongitude}&directionsmode=${travelMode}`;
			} else {
				// Open in browser
				window.open(googleMapsUrl, '_blank');
			}
		}
	};

	return (
		<div className='main'>
			<div className='icon'>
				<Tooltip title='Start Navigation'>
					<IconButton onClick={handleButtonClick}>
						<NavigationIcon style={{ fontSize: '40px', color: '#c7edef' }} />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
}

export default NavigationButton;
