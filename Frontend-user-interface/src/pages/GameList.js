import React, {useEffect, useState} from 'react';
import '../styles/Games.css'
import {redirect, useNavigate} from "react-router-dom";
import NewGame from "./NewGame";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import GameDetails from "./GameDetails";

const gameData = {
    id1: {
        name: "Jeu 1",
        date: "2023-01-01",
        teams: {
            team1: {name: "Équipe A1", roomid: "A1"},
            team2: {name: "Équipe A2", roomid: "A2"}
        }
    },
    id2: {
        name: "Jeu 2",
        date: "2023-02-01",
        teams: {
            team1: {name: "Équipe B1", roomid: "B1"}
        }
    },
    id3: {
        name: "Jeu 3",
        date: "2023-03-01",
        teams: {
            team1: {name: "Équipe C1", roomid: "C1"},
            team2: {name: "Équipe C2", roomid: "C2"}
        }
    },
    id4: {
        name: "Jeu 4",
        date: "2023-04-01",
        teams: {
            team1: {name: "Équipe D1", roomid: "D1"},
            team2: {name: "Équipe D2", roomid: "D2"},
            team3: {name: "Équipe D3", roomid: "D3"}
        }
    },
    id5: {
        name: "Jeu 5",
        date: "2023-05-01",
        teams: {
            team1: {name: "Équipe E1", roomid: "E1"}
        }
    }
};


const GameList = () => {
    const [fetchData, setfetchData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [creatingNewGame, setCreatingNewGame] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetails, setShowDetails] = useState(false); // Nouvel état ajouté

    const handleCreateGame = () => {
        console.log("Create game function");
        setCreatingNewGame(true);
    };

    const handleDetails = () => {
        console.log("Details game function");
        setShowDetails(true); // Activer l'affichage du détail
    };

    useEffect(() => {
        setfetchData(gameData);
        const firstGameId = Object.keys(gameData)[0];
        setSelectedRow(firstGameId);
        setIsLoaded(true);
    }, []);

    const buttonText = selectedRow ? "Détails" : "Aucun match Sélectionné";

    const isButtonDisabled = !selectedRow;

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (creatingNewGame) {
        return <NewGame onCancel={() => setCreatingNewGame(false)} />;
    } else if (showDetails) {
        return <GameDetails gameId={selectedRow} onBack={() => setShowDetails(false)} />;
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
                    <button className="create-button" onClick={handleCreateGame}>
                        Créer une nouvelle partie
                    </button>
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

    const removeTeam = (id) => {
        console.log(`Remove team function for game ${id}`);
    };

    const renderGameItem = (id) => (
        <li key={id} className={id === props.selectedRow ? 'selected-row' : ''}>
            {props.selectedRow === id && (
                <div className="buttons">
                    <button type="button" className="action-button modify-button">
                        <span role="img" aria-label="Modifier">⚙️</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => removeTeam(id)}
                        className='action-button remove-button'
                    >
                        <span role="img" aria-label="Supprimer">-</span>
                    </button>
                </div>
            )}
            <div className="game-info" onClick={() => {handleRowClick(id); props.setSelectedRow(id)}}>
                <span>{props.data[id].name}</span>
                <span>{props.data[id].date}</span>
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