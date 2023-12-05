import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import './Help.css';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import React from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

function Help() {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<React.Fragment>
			<div className='image' onClick={handleClickOpen}>
				<Tooltip title='Pomoc'>
					<IconButton>
						<HelpOutlineOutlinedIcon style={{ fontSize: '30px', color: 'black' }} />
					</IconButton>
				</Tooltip>
			</div>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby='customized-dialog-title'
				open={open}
				sx={{
					marginLeft: '19%', //center it to main-container (change this solution later)
				}}
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
					Miasto 15 minutowe
				</DialogTitle>
				<IconButton
					aria-label='close'
					onClick={handleClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent dividers>
					<Typography sx={{ p: 0.5 }} gutterBottom>
						Wybierz lokalizację startową poprzez kliknięcie w dowolne miejsce na mapie, wybranie miasta poprzez
						wyszukiwarke miast lub poprzez podanie adresu konkretnego miejsca w panelu po lewej stronie.
					</Typography>
					<Typography sx={{ p: 0.5 }} gutterBottom>
						Następnie wybierz konkretne kategorie miejsc, które cię interesują i kliknij przycisk "Wyszukaj miejsca w
						pobliżu".
					</Typography>
					<Typography sx={{ p: 0.5 }} gutterBottom>
						Kategorie oraz rodzaj transportu znajdujący się w lewym górnym rogu mapy można zmieniać na bieżąco, aby
						zmiany zostały zarejestrowane kliknij ponownie przycisk do wyszukiwania.
					</Typography>
					<Typography sx={{ p: 0.5 }} gutterBottom>
						Aby wyświetlić drogę do jakiegokolwiek ze znaczników wyświetlonych na mapie i informację o nim, kliknij na
						konkretny znacznik.
					</Typography>
				</DialogContent>
			</BootstrapDialog>
		</React.Fragment>
	);
}

export default Help;
