import * as React from 'react';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader, IconButton, Menu, MenuItem, Dialog,
    DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { grey } from '@mui/material/colors';
import Box from "@mui/material/Box"
import { redirect } from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import domtoimage from 'dom-to-image';
import { jsPDF } from "jspdf";

function MapOptions(...props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [downloadDialogOpen, setDownloadDialogOpen] = React.useState(false);
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
    const handleCloseDownloadDialog = () => {
        setDownloadDialogOpen(false);
    };
    const handleOpenDownloadDialog = () => {
        setDownloadDialogOpen(true);
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
                <MenuItem onClick={() => { console.log('modifying'); handleClose() }}>Modifier</MenuItem>
                <MenuItem onClick={handlePublish}>Publier</MenuItem>
                <MenuItem onClick={() => { handleClose(); window.open(props[0]['img'], '_blank') }}>Agrandir</MenuItem>
                <MenuItem onClick={handleOpenDownloadDialog}>Télécharger</MenuItem>
                <MenuItem onClick={handleClose}>Supprimer</MenuItem>
            </Menu>
            <Popup publishOpen={publishOpen} publishClose={handlePublishClose}/>
            <DownloadDialog mapId={props[0]['id']} downloadDialogOpen={downloadDialogOpen} handleCloseDownloadDialog={handleCloseDownloadDialog}/>
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

function DownloadDialog (props) {
    const [downloadFormat, setDownloadFormat] = React.useState('png');
    const handleDownloadFormatChange = (event) => {
        setDownloadFormat(event.target.value);
    };
    const handleDownload = () => {
        const node = document.getElementById(props.mapId);
        console.log(props.mapId)
    
        switch (downloadFormat) {
            case 'png':
                domtoimage.toPng(node)
                    .then((dataUrl) => {
                        const link = document.createElement('a');
                        link.download = 'my-image.png';
                        link.href = dataUrl;
                        link.click();
                    });
                break;
            case 'jpg':
                domtoimage.toJpeg(node, { quality: 0.95 })
                    .then((dataUrl) => {
                        const link = document.createElement('a');
                        link.download = 'my-image.jpg';
                        link.href = dataUrl;
                        link.click();
                    });
                break;
            case 'pdf':
                domtoimage.toPng(node)
                    .then((dataUrl) => {
                        const pdf = new jsPDF();
                        pdf.addImage(dataUrl, 'PNG', 0, 0);
                        pdf.save("my-document.pdf");
                    });
                break;
            default:
                break;
        }
    
        props.handleCloseDownloadDialog();
    };
    return (
        <Dialog open={props.downloadDialogOpen} onClose={props.handleCloseDownloadDialog}>
            <DialogTitle style={{ color: 'black' }}>Choisir le format de téléchargement</DialogTitle>
            <DialogContent>
                <RadioGroup value={downloadFormat} onChange={handleDownloadFormatChange}>
                    <FormControlLabel value="png" control={<Radio />} label="PNG" />
                    <FormControlLabel value="jpg" control={<Radio />} label="JPG" />
                    <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCloseDownloadDialog}>Annuler</Button>
                <Button onClick={handleDownload}>Enregistrer</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function MapList() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [itemData, setItemData] = useState([]);

    const fetchMaps = (uid) => {
        console.log(uid)
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
                                id={item.id}
                                src={item.img}
                                srcSet={item.img}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.author}
                                actionIcon={
                                    <div>
                                        <MapOptions id={item.id} img={item.img}/>
                                    </div>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        );
    }
}