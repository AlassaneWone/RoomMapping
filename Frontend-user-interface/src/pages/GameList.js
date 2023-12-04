import React, {useEffect, useState} from 'react';
import '../styles/GameList.css'
import {redirect} from "react-router-dom";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

const GameList = (props) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [fetchData, setfetchData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleDetails = () => {
        console.log(`Details for game ${selectedRow}`);
    };

    const fetchGames = (uid) => {
        fetch(`${apiUrl}/api/game/${uid}/${props.mapId}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("There has been a problem with your fetch operation")
            })
            .then(data => {
                setfetchData(data);
                setIsLoaded(true)
            }).catch((error) => {
            console.log('error: ' + error);
        });
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchGames(uid);

            } else {
                redirect('/login');
            }
        });
    }, []);

    const buttonText = selectedRow ? "Détails" : "Aucun match Sélectionné";

    const isButtonDisabled = !selectedRow;

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div className="header">
                    <span>Matchs :</span>
                </div>
                <div className="games-container">
                    <div className="scrollable-game-container">
                        <ListeDesJeux
                            data={fetchData}
                            selectedRow={selectedRow}
                            setSelectedRow={setSelectedRow}
                        />
                    </div>
                </div>
                <DialogActions>
                    <Button onClick={handleDetails} disabled={isButtonDisabled}>
                        {buttonText}
                    </Button>
                </DialogActions>
            </div>
        );
    }
};

const ListeDesJeux = (props) => {

    const handleRowClick = (id) => {
        props.setSelectedRow(id === props.selectedRow ? null : id);
    };

    const removeGame = (gameId) => {
        console.log(`Remove game function for game ${gameId}`);
    };

    const renderGameItem = (id) => (
        <li key={id} className={id === props.selectedRow ? 'selected-row' : ''}>
            {props.selectedRow === id && (
                <div className="buttons">
                    <button type="button" className="action-button modify-button">
                        <span role="img" aria-label="Modifier"><SettingsIcon/></span>
                    </button>
                    <button
                        type="button"
                        onClick={() => removeGame(props.data[id].gameId)} // Pass gameId to removeGame
                        className='action-button remove-button'
                    >
                        <span role="img" aria-label="Supprimer"><DeleteIcon/></span>
                    </button>
                </div>
            )}
            <div className="game-info" onClick={() => {
                handleRowClick(id);
                props.setSelectedRow(id);
            }}>
                <span>{props.data[id].name}</span>
                <span>{<span>{new Intl.DateTimeFormat('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(new Date(props.data[id].date)) + ' à ' + new Date(props.data[id].date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
                }</span>
            </div>
        </li>
    );

    return (
        <div>
            <ul>
                {Object.keys(props.data).map((id, index) => (
                    <React.Fragment key={id}>
                        {renderGameItem(id)}
                        {index === Object.keys(props.data).length - 1 && (
                            <li className="empty-element"/>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};


export default GameList