import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import './TransportButton.css';
import { useState } from 'react';

function TransportationButton({ setActiveTransportButton }) {
	const [activeButton, setActiveButton] = useState('walk');

	const handleButtonClick = (buttonType: string) => () => {
		console.log(`${buttonType} clicked`);
		setActiveButton(buttonType);
		setActiveTransportButton(buttonType);
	};

	return (
		<div className='transportation-button'>
			<div
				className='button-side'
				onClick={handleButtonClick('walk')}
				style={{ backgroundColor: activeButton === 'walk' ? '#90caf9' : '' }}
			>
				<DirectionsWalkIcon />
			</div>
			<div
				className='button-side'
				onClick={handleButtonClick('bike')}
				style={{ backgroundColor: activeButton === 'bike' ? '#90caf9' : '' }}
			>
				<DirectionsBikeIcon />
			</div>
		</div>
	);
}

export default TransportationButton;
