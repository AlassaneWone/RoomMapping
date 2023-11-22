import React, {useState} from 'react';
import '../styles/NewGame.css';
import {redirect} from "react-router-dom";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const NewGame = ({onCancel}) => {
    const [gameName, setGameName] = useState('');
    const [gameDate, setGameDate] = useState('');
    const [gameTime, setGameTime] = useState('');
    const [teams, setTeams] = useState(['', '']);

    const addTeam = () => {
        setTeams([...teams, '']);
    };

    const removeTeam = (index) => {
        if (teams.length > 2) {
            const updatedTeams = [...teams];
            updatedTeams.splice(index, 1);
            setTeams(updatedTeams);
        }
    };

    const updateTeamName = (index, teamName) => {
        const updatedTeams = [...teams];
        updatedTeams[index] = teamName;
        setTeams(updatedTeams);
    };

    const submitForm = () => {
        if (gameName && gameDate && gameTime && teams.every(team => team.trim() !== '')) {
            console.log('Nom du match:', gameName);
            console.log('Date du match:', gameDate);
            console.log('Heure du match:', gameTime);
            console.log('Équipes:', teams);
        } else {
            console.log('Veuillez remplir tous les champs');
        }

    };

    return (<div>
            <div className="header">
                <span>Créer un nouveau match :</span>
            </div>
            <div className="new-game-container">
                <label>Nom du match:</label>
                <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Entrez le nom du match"
                    required
                />

                <label>Date:</label>
                <input
                    type="date"
                    value={gameDate}
                    onChange={(e) => setGameDate(e.target.value)}
                    required
                />

                <label>Heure:</label>
                <input
                    type="time"
                    value={gameTime}
                    onChange={(e) => setGameTime(e.target.value)}
                    required
                />

                <label>Équipes:</label>
                {teams.map((team, index) => (
                    <div key={index} className="team-container">
                        <input
                            type="text"
                            value={team}
                            onChange={(e) => updateTeamName(index, e.target.value)}
                            placeholder={`Nom de l'équipe ${index + 1}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeTeam(index)}
                            className={`remove-button ${teams.length <= 2 ? 'disabled' : ''}`}
                            disabled={teams.length <= 2}
                        >
                            -
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addTeam}>
                    Ajouter une équipe
                </button>

                <DialogActions>
                    <Button onClick={submitForm}>
                        Soumettre
                    </Button>
                </DialogActions>
            </div>
        </div>
    );
};

export default NewGame;
