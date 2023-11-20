import * as React from 'react';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader, IconButton, Menu, MenuItem, Box,
    DialogActions, DialogContent, Button, Dialog, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { grey } from '@mui/material/colors';

import { useNavigate } from "react-router-dom";

function MapOptions(...props) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publishOpen, setPublishOpen] = React.useState(false);
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
    const toMapEditor = () => {
        navigate('/mapEditor', {
            state: props[0]['img']
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
                <MenuItem onClick={() => {
                    handleClose();
                    window.open(props[0]['img'], '_blank')
                }}>Agrandir</MenuItem>
            </Menu>
            <Popup publishOpen={publishOpen} publishClose={handlePublishClose}/>
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
    return(
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
                        <FormControlLabel value="group" control={<Radio/>} label="group"/>
                    </RadioGroup>
                </FormControl>
                {popupContent === 'statique' && <div>
                    <p>this will publish a static map</p>
                    <Button onClick={handlePlaceHolder}>Placeholder</Button>
                </div>}
                {popupContent === 'dynamique' && <div>
                    <p>dynamique</p>
                </div>}
                {popupContent === 'group' && <div>
                    <p>group</p>
                </div>}

            </DialogContent>
            <DialogActions>
                <Button onClick={props.publishClose}>Valider</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function MapList() {
    return (
        <Box style={{justifyContent:'center', display:'flex',height:'90vh'}} sx={{width:1}}>
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
                                <MapOptions img={item.img}/>
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
        img: require('../assets/CS-minimap.png'),
        title: 'Plan 1',
        rows: 2,
        cols: 2,
        featured: true,
    },
    {
        img: require('../assets/CS_dust.png'),
        title: 'Dust 1',
    },
    {
        img: require('../assets/CS_cache.png'),
        title: 'Cache',
    },
    {
        img: require('../assets/Slam_map.png'),
        title: 'Slam algo mock',
        cols: 2,
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 5',
    },
];
