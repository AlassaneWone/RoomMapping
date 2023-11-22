import "../styles/MyAccount.css";
import React, { useState, useEffect } from 'react'
import { useNavigate} from "react-router-dom";

import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const MyAccount = () => {

    const navigate = useNavigate();
    const auth = getAuth();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in");
                setUser(user);
            } else {
                console.log("User is signed out");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

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
        <div className="account-container">
            <h1 className="account-title">Mon compte</h1>
            <p className="account-text">Vous êtes connecté en tant que {user ? user.email : "No user"}</p>
            <Button className="button-logout" onClick={logout} variant="contained" endIcon={<LogoutIcon />}>
                Se déconnecter
            </Button>
            <Button className="Button" onClick={handleClickOpen} variant="contained" color="error" endIcon={<DeleteForeverIcon />}>
                Supprimer mon compte
            </Button>
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
        </div>
    )
}

export default MyAccount
