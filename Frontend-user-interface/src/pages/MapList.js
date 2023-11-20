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
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Box from "@mui/material/Box"
import Games from "./Games";

function MapOptions(...props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('statique');
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
    const [childData, setChildData] = React.useState(null)

    const handleRadioChange = (event: event) => {
        setPopupContent(event.target.value);
    };
    const handlePlaceHolder = () => {
        console.log('placeholder function for publishing static map')
    }
    const handleValidate = () => {
        if(popupContent === 'statique'){
            console.log('publishing static map')
        }
        else if(popupContent === 'dynamique'){
            console.log('publishing dynamic map')
        }
        else if(popupContent === 'group' && childData != null){
            console.log('go to match details page')
        }
        else
        console.log('publishing map')
    }

    const handleChildData = (childData) => {
        setChildData(childData)
        console.log(childData)
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
                        <FormControlLabel value="group" control={<Radio/>} label="Matchs"/>
                    </RadioGroup>
                </FormControl>
                {popupContent === 'statique' && <div>
                    <p>this will publish a static map</p>
                    <Button onClick={handlePlaceHolder}>Placeholder</Button>
                </div>}
                {popupContent === 'dynamique' && <div>
                    <p>dynamique</p>
                </div>}
                {popupContent === 'group' && (<div>
                    <Games onChildData={handleChildData}/>
                </div>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleValidate}>Valider</Button>
            </DialogActions>
        </Dialog>
    )
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
        img: require('../assets/parcelle.png'),
        title: 'Plan 1',
        rows: 2,
        cols: 2,
        featured: true,
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 2',
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 3',
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 4',
        cols: 2,
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 5',
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 6',
    },
    {
        img: require('../assets/parcelle.png'),
        title: 'Plan 7',
    },
];

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
};