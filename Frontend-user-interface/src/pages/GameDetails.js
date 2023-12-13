import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {redirect} from "react-router-dom";
import '../styles/GameDetails.css'
import Button from "@mui/material/Button";

const GameDetails = (props) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [fetchData, setfetchData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                fetchGame(uid);

            } else {
                redirect('/login');
            }
        });
    }, []);

    const fetchGame = (uid) => {
        fetch(`${apiUrl}/api/game/${uid}/${props.mapId}/${props.gameId}`)
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
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopySuccess('ID copié dans le presse-papiers !');
                setTimeout(() => setCopySuccess(''), 2000); // Disparaît après 2 secondes
            })
            .catch(err => {
                console.log('Erreur lors de la copie :', err);
            });
    };

    if (!isLoaded) {
        return <div>Loading...</div>
    } else if (fetchData) {
        const {date, teams, name} = fetchData;

        return (
            <div>
                <Button type="button" onClick={props.onCancel} className={"back-button"}>
                    Retour
                </Button>
                <div className="game-details">
                    <h1>{name}</h1>
                    <div className="game-info">
                        <p>Date: {new Date(date).toLocaleDateString('fr-FR')}</p>
                        <p>Heure: {new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                    <div className="teams">
                        <h2>Équipes :</h2>
                        <ul>
                            {teams.map((team, index) => (
                                <li key={index} className="team-item">
                                    <span className="team-name">{team.name}</span>
                                    <span className="team-room-id" onClick={() => copyToClipboard(team.roomId)}>
                    {team.roomId}
                </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {copySuccess && (
                    <div className="copy-success-toast">
                        {copySuccess}
                    </div>
                )}
            </div>
        );
    } else {
        return <div>No data available</div>;
    }
}

export default GameDetails;