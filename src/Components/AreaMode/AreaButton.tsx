import { useState } from 'react';
import './AreaButton.css';

function AreaButton({ setActiveAreaButton }) {
	const [activeButton, setActiveButton] = useState('15');

	const handleButtonClick = (buttonType: string) => () => {
		// @@ z finalnej wersji aplikacji (tej przeznaczonej dla użytkownika) zazwyczaj usuwa się console.logi, jako że user może je podejrzeć
		// i dowiedzieć się rzeczy, które czasem niekoniecznie chcielibyśmy, żeby wiedział
		console.log(`${buttonType} clicked`);
		setActiveButton(buttonType);
		setActiveAreaButton(buttonType);
	};

	return (
		<div className='area-button'>
			<div
				className='button-side-area'
				onClick={handleButtonClick('15')}
				style={{ backgroundColor: activeButton === '15' ? '#8BC34A' : '' }}
			>
				15min
			</div>
			<div
				className='button-side-area'
				onClick={handleButtonClick('30')}
				style={{ backgroundColor: activeButton === '30' ? '#FF5252' : '' }}
			>
				30min
			</div>
		</div>
	);
}

export default AreaButton;
