import React, {useState} from 'react';
import '../styles/NewGame.css';
import {redirect} from "react-router-dom";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect} from "react";

const NewGame = (props) => {
    const [gameName, setGameName] = useState('');
    const [gameDate, setGameDate] = useState('');
    const [gameTime, setGameTime] = useState('');
    const [teams, setTeams] = useState(['', '']);
    const [userId, setUserId] = useState('');

    const addTeam = () => {
        setTeams([...teams, '']);
    };
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
            }
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
    }, []);

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

    const generateRandomSessionId = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const submitForm = () => {
        const currentDate = new Date();
        const selectedDate = new Date(`${gameDate}T${gameTime}`);
        if (gameName && gameDate && gameTime && teams.every(team => team.trim() !== '')) {
            if (selectedDate <= currentDate) {
                errorDisplay(["La date et l'heure doivent être dans le futur."]);
                return;
            }
            const formData = {
                userId: userId,
                mapId: props.mapId,
                name: gameName,
                date: selectedDate,
                teams: teams.map((team, index) => ({
                    name: team.trim(),
                    roomId: generateRandomSessionId()
                }))
            };

            console.log(JSON.stringify(formData));

            fetch(`http://localhost:5000/api/game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => {
                return response.json();
            }).then(res => {
                if (res === 201) {
                    successDisplay();
                } else {
                    errorDisplay([res.errors]);
                }
            });
        } else {
            errorDisplay(['Veuillez remplir tous les champs']);
        }
    };

    const successDisplay = () => {
        console.log("Votre partie a bien été créée !")
    }

    const errorDisplay = (errors) => {
        for(let i of errors) {
            console.log(i)
        }
    }

    return (<div><Button type="button" onClick={props.onCancel}>
            Retour
        </Button>
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
