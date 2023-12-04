import './DropDownCategoriesSearch.css';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const options = [
	{ value: 'university', label: 'uniwersytet' },
	{ value: 'bank', label: 'bank' },
	{ value: 'police', label: 'komisariat' },
	{ value: 'ATM', label: 'ATM' },
	{ value: 'bakery', label: 'piekarnia' },
	{ value: 'bar', label: 'bar' },
	{ value: 'hair_care', label: 'fryzjer' },
	{ value: 'cafe', label: 'kawiarnia' },
	{ value: 'church', label: 'kościół' },
	{ value: 'shopping_mall', label: 'centrum handlowe' },
	{ value: 'store', label: 'sklep' },
	{ value: 'doctor', label: 'lekarz' },
	{ value: 'pharmacy', label: 'przychodnia' },
	{ value: 'gas_station', label: 'stacja benzynowa' },
	{ value: 'gym', label: 'siłownia' },
	{ value: 'hardware_store', label: 'sklep z narzędziami' },
	{ value: 'hospital', label: 'szpital' },
	{ value: 'laundry', label: 'pralnia' },
	{ value: 'library', label: 'biblioteka' },
	{ value: 'meal_delivery', label: 'dostawa jedzenia' },
	{ value: 'movie_theater', label: 'kino' },
	{ value: 'night_club', label: 'klub / bar' },
	{ value: 'park', label: 'park' },
	{ value: 'parking', label: 'parking' },
	{ value: 'post_office', label: 'poczta' },
	{ value: 'restaurant', label: 'restauracja' },
	{ value: 'school', label: 'szkoła' },
	{ value: 'stadium', label: 'stadion' },
	{ value: 'supermarket', label: 'supermarket' },
	{ value: 'train_station', label: 'stacja kolejowa' },
	{ value: 'veterinary_care', label: 'weterynarz' },
	{ value: 'lodging', label: 'hotel / mieszkanie' },
	{ value: 'transit_station', label: 'przystanek autobusowy' },
	{ value: 'home_goods_store', label: 'sklep dekoracyjny / budowlany' },
];

function DropDownCategoriesSearch({ setCategoriesTypes }) {
	const handleCategoriesChange = (_, selectedOptions) => {
		const selectedValues = selectedOptions.map((option) => option.value);
		console.log(selectedValues);
		setCategoriesTypes(selectedValues);
	};

	return (
		<Autocomplete
			className='dropdown'
			multiple
			limitTags={3}
			id='checkboxes-tags-demo'
			options={options}
			disableCloseOnSelect
			getOptionLabel={(option) => option.label}
			onChange={handleCategoriesChange}
			renderOption={(props, option, { selected }) => (
				<li {...props}>
					<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
					{option.label}
				</li>
			)}
			renderInput={(params) => <TextField {...params} label='Wybierz kategorie miejsc' />}
		/>
	);
}

export default DropDownCategoriesSearch;
