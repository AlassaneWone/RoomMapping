import React, {useEffect, useState} from 'react';
//import parse from 'html-react-parser'

function Games() {
    const [fetchData, setfetchData] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [formData] = useState({
        adresse: "",
        url: "",
        games: {
            id: {name: "", date: "", teams: {id: {name: "", roomid: ""}}}
        }
    });

    const fetchGames = () => {
        fetch("https://osk.vercel.app/api/games")
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error("There has been a problem with your fetch operation")
            })
            .then(data => {
                setfetchData([data]);
                setIsLoaded(true)
            }).catch((error) => {
            console.log('error: ' + error);
        });
    }

    const fetchMockGames = async () => {
        try {
            const response = await fetch('/path/to/mockdatagames.json');
            if (!response.ok) {
                throw new Error("There has been a problem with your fetch operation");
            }
            const data = await response.json();
            setfetchData([data]);
            setIsLoaded(true);
        } catch (error) {
            console.log('error: ' + error);
        }
    };

    useEffect(() => {
        fetchMockGames()
    }, [])

    if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return <div>
            <ListeDesJeux/>
        </div>
    }
}

const ListeDesJeux = ({jeux, onSupprimer, onModifier}) => {
    return (
        <ul>
            {Object.keys(jeux).map((id) => (
                <li key={id}>
                    <div>
                        <strong>Nom du jeu :</strong> {jeux[id].name} <br/>
                        <strong>Date :</strong> {jeux[id].date} <br/>
                        <strong>Équipes :</strong>
                        <ul>
                            {Object.keys(jeux[id].teams).map((teamId) => (
                                <li key={teamId}>
                                    {jeux[id].teams[teamId].name} - {jeux[id].teams[teamId].roomid}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => onModifier(id)}>Modifier</button>
                    <button onClick={() => onSupprimer(id)}>Supprimer</button>
                </li>
            ))}
        </ul>
    );
};

export default Games