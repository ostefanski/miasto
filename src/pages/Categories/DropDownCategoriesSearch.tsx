import './DropDownCategoriesSearch.css';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function DropDownCategoriesSearch() {
	const animatedComponents = makeAnimated();
	const options = [
		{ value: 'chocolate', label: 'Chocolate' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' },
	];

	const customStyles = {
		control: (provided) => ({
			...provided,
			paddingTop: 9,
			paddingBottom: 9,
		}),
	};

	return (
		<div className='test'>
			<Select
				closeMenuOnSelect={false}
				components={animatedComponents}
				defaultValue={[options[4], options[5]]}
				isMulti
				placeholder='Wybierz kategorie miejsc'
				options={options}
				styles={customStyles}
			/>
		</div>
	);
}

export default DropDownCategoriesSearch;
