import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {grey} from '@mui/material/colors';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Box from "@mui/material/Box"
import GameList from "./GameList";

function MapOptions(...props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [matchPopupOpen, setMatchPopupOpen] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handlePublish = () => {
        setPublishOpen(true);
        handleClose();
    };
    const handlePublishClose = () => {
        setPublishOpen(false);
    }

    const handleMatchPopup = () => {
        setMatchPopupOpen(true);
        handleClose();
    };

    return (
        <Box>
            <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon sx={{color: grey[50]}}/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    console.log('modifying');
                    handleClose()
                }}>Modifier</MenuItem>
                <MenuItem onClick={handleClose}>Supprimer</MenuItem>
                <MenuItem onClick={handlePublish}>Publier</MenuItem>
                <MenuItem onClick={handleMatchPopup}>Matchs</MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    window.open(props[0]['img'], '_blank')
                }}>Agrandir</MenuItem>
            </Menu>
            <Popup publishOpen={publishOpen} publishClose={handlePublishClose} mapId={props[0]['mapId']}/>
            <MatchPopup open={matchPopupOpen} onClose={() => setMatchPopupOpen(false)} mapId={props[0]['mapId']} />
        </Box>
    )
}

function Popup(props) {
    const [popupContent, setPopupContent] = React.useState('statique')

    const handleRadioChange = (event: event) => {
        setPopupContent(event.target.value);
    };
    const handlePlaceHolder = () => {
        console.log('placeholder function for publishing static map')
    }
    const handleValidate = () => {
        console.log('validate function for publishing static map')
    }

    return (
        <Dialog open={props.publishOpen} onClose={props.publishClose}>
            <DialogContent>
                <FormControl>
                    <FormLabel>Type de map</FormLabel>
                    <RadioGroup
                        row
                        value={popupContent}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="statique" control={<Radio/>} label="statique"/>
                        <FormControlLabel value="dynamique" control={<Radio/>} label="dynamique"/>
                    </RadioGroup>
                </FormControl>
                {popupContent === 'statique' && <div>
                    <p>this will publish a static map</p>
                    <Button onClick={handlePlaceHolder}>Placeholder</Button>
                </div>}
                {popupContent === 'dynamique' && <div>
                    <p>dynamique</p>
                </div>}
            </DialogContent>
            {popupContent !== 'group' && (
                <DialogActions>
                    <Button onClick={handleValidate}>
                        Valider
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}

function MatchPopup(props) {
    const handleValidate = () => {
        console.log('validate function for match popup');
        // Ajoutez ici la logique nécessaire pour valider les matchs
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <GameList mapId={props.mapId}/>
        </Dialog>
    );
}


export default function MapList() {
    return (
        <Box style={{justifyContent: 'center', display: 'flex', height: '90vh'}} sx={{width: 1}}>
            <ImageList sx={{width: 700, height: 1000}}>
                <ImageListItem key="Subheader" cols={2}>
                    <ListSubheader component="div">Nombre de scans : {itemData.length}</ListSubheader>
                </ImageListItem>
                {itemData.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            src={item.img}
                            srcSet={item.img}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.title}
                            subtitle={item.author}
                            actionIcon={
                                <MapOptions img={item.img} mapId={item.id}/>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}

const itemData = [
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 1',
        rows: 2,
        cols: 2,
        featured: true,
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 2',
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 3',
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 4',
        cols: 2,
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 5',
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/parcelle.png'),
        title: 'Plan 6',
    },
    {
        id: "KPReniUNwqmrLBI0Rxai",
        img: require('../assets/radar.png'),
        title: 'Plan 7',
    },
];
