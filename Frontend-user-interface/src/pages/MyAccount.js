import "../styles/MyAccount.css";
import React, { useState, useEffect } from 'react'
import { useNavigate} from "react-router-dom";

import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Button, Box, Avatar,
        Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, deleteDoc, getDoc } from "firebase/firestore";

const MyAccount = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in");
                setUser(user);
                const db = getFirestore();
                const docRef = doc(db, "users", user.uid);
            
                getDoc(docRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    setUserData(docSnapshot.data());
                } else {
                    console.log("No such document!");
                }
                }).catch((error) => {
                console.log("Error getting document:", error);
                });
            } else {
                console.log("User is signed out");
            }
        });

        return () => unsubscribe();
    }, [user]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const logout = () => {
        auth.signOut().then(() => {
            console.log("User signed out");
            setUser(null);
            navigate('/login');
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }

    const deleteUser = () => {
        const user = auth.currentUser;
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);

        deleteDoc(userRef).then(() => {
            console.log("User document deleted from Firestore");
            user.delete().then(() => {
                console.log("User deleted from Firebase Auth");
                setUser(null);
                navigate('/login');
                window.location.reload();
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log("Error removing user document: ", error);
        });
    }

    return (
        <Box className="account-container">
            <Card elevation={10} style={{ backgroundColor: '#f5f5f5', border: '1px solid #f5f5f5', width: '20%', height: '50%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Typography variant="h3" component="h1" className="account-title">Mon Compte</Typography>
                        <Avatar sx={{ bgcolor: '#3F72AF' }}>
                            <AccountCircleIcon />
                        </Avatar>
                    </Box>
                    <List>
                        <ListItem>
                            <ListItemText primary="Nom" secondary={userData ? userData.lastname : ''} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Prénom" secondary={userData ? userData.firstname : ''} />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemText primary="Email" secondary={user?.email || ''} />
                        </ListItem>
                    </List>
                    <Box className="button-logout">
                        <Button variant="contained" startIcon={<LogoutIcon />} onClick={logout}>Se déconnecter</Button>
                    </Box>
                    <Box className="button-delete-account">
                        <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={handleClickOpen}>Supprimer le compte</Button>
                    </Box>
                    <Dialog 
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Confirmer la suppression de votre compte"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Annuler
                            </Button>
                            <Button onClick={deleteUser} color="error" autoFocus>
                                Supprimer
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        </Box>
    )
}

export default MyAccount
