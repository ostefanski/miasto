import { Fragment } from 'react';
import './SearchNearbyButton.css';

function SearchNearbyButton({ setCount }) {
	const handleButtonClick = () => {
		setCount((count) => count + 1);
	};

	const Button = ({ as: Element, children, filled, secondary, ...rest }) => {
		return (
			<Element
				className={`dir-control ${secondary ? 'dir-control--secondary' : ''} ${filled ? 'dir-control--filled' : ''}`}
				{...rest}
				onClick={handleButtonClick}
			>
				{children}
				<span />
				<span />
				<span />
				<span />
				<b aria-hidden='true'>{children}</b>
				<b aria-hidden='true'>{children}</b>
				<b aria-hidden='true'>{children}</b>
				<b aria-hidden='true'>{children}</b>
			</Element>
		);
	};

	Button.defaultProps = {
		as: 'button',
	};

	return (
		<Fragment>
			<Button as={undefined} filled={undefined} secondary={undefined}>
				Wyszukaj miejsca w pobliżu
			</Button>
		</Fragment>
	);
}

export default SearchNearbyButton;
