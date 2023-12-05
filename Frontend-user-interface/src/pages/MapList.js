import * as React from 'react';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader, IconButton, Menu, MenuItem, Box,
    DialogActions, DialogContent, Button, Dialog, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
import {grey} from '@mui/material/colors';
import GameList from "./GameList";
import {redirect} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";

function MapOptions(...props) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [matchPopupOpen, setMatchPopupOpen] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
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

    const toMapEditor = () => {
        navigate('/mapEditor', {
            state: props[0]['mapId']
        })
    }
    
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
                <MenuItem onClick={toMapEditor}>Modifier</MenuItem>
                <MenuItem onClick={handleClose}>Supprimer</MenuItem>
                <MenuItem onClick={handlePublish}>Publier</MenuItem>
                <MenuItem onClick={handleMatchPopup}>Matchs</MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    window.open(props[0]['img'], '_blank')
                }}>Agrandir</MenuItem>
            </Menu>
            <Popup publishOpen={publishOpen} publishClose={handlePublishClose} mapId={props[0]['mapId']}/>
            <MatchPopup open={matchPopupOpen} onClose={() => setMatchPopupOpen(false)} mapId={props[0]['mapId']}/>
        </Box>
    )
}

function Popup(props) {
    const [popupContent, setPopupContent] = React.useState('statique')

    const handleRadioChange = (event) => {
        setPopupContent(event.target.value);
    };
    const handlePlaceHolder = () => {
        console.log('placeholder function for publishing static map')
    }
    const handleValidate = () => {
        console.log('validate function for publishing static map')

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
}

function MatchPopup(props) {
    const handleValidate = () => {
        console.log('validate function for match popup');
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <GameList mapId={props.mapId}/>
        </Dialog>
    );
}


export default function MapList() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [itemData, setItemData] = useState([]);

    const fetchMaps = (uid) => {
        fetch(`http://localhost:5000/api/map/${uid}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("There has been a problem with your fetch operation")
            })
            .then(data => {
                setItemData(convertToImageListData(data));
                setIsLoaded(true)
            }).catch((error) => {
            console.log('error: ' + error);
        });
    };

    function convertToImageListData(data) {
        return data.map(item => ({
            id: item.mapId,
            img: item.url,
            title: `Image ${item.mapId}`,
            rows: 2,
            cols: 2,
            featured: true,
        }));
    }

    useEffect(() => {
        setIsLoaded(true)
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchMaps(uid);
            } else {
                redirect('/login');
            }
        });
    }, []);
    if (!isLoaded) {
        return <div>Loading...</div>
    } else {
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
}
