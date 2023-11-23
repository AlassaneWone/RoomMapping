const {upload} = require('../s3.js');
const {db} = require('../db.js');
const {FieldValue} = require("firebase-admin/firestore");
const {type} = require("http-errors");

exports.getGames = async (req, res) => {
    console.log("Called")
    try {
        const gamesCollection = db.collection(`users/${req.params.uid}/maps/${req.params.mid}/games`);

        // Get all games in the collection
        const snapshot = await gamesCollection.get();

        // Initialize an array to store the games
        const games = [];

        // Iterate through each document in the collection
        snapshot.forEach((doc) => {
            // Extract the data of each game
            const gameData = doc.data();

            // Add the game data to the array
            games.push({
                gameId: doc.id,
                ...gameData
            });
        });

        res.status(200).json(games); // Respond with the array of games
    } catch (error) {
        console.error('Erreur lors de la récupération des parties :', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getGame = async (req, res) => {
};

exports.createGame = async (req, res) => {
    function dataVerification() {
        let errors = [];

        if (typeof req.body.userId !== "string" || req.body.userId === "") {
            errors.push("userId must be a string and not empty")
        } else if (typeof req.body.mapId !== "string" || req.body.mapId === "") {
            errors.push("mapId must not be empty and must be a string")
        } else if (typeof req.body.name !== "string" || req.body.name === "") {
            errors.push("name must be a string")
        } else if (typeof req.body.date !== "string" || isNaN(new Date(req.body.date).getTime())){
            errors.push("date must be a string and must be in a date format")
        } else if (typeof req.body.teams !== "object" || req.body.teams.length < 2) {
            errors.push("teams must be an array and must contain at least 2 teams")
        } else if (errors.length === 0) {
            return true
        } else {
            res.status(422).send({errors});
            return false
        }
    }

    if (dataVerification()) {
        try {
            const gamesCollection = db.collection(`users/${req.body.userId}/maps/${req.body.mapId}/games`);
            const {userId, mapId, ...newData} = req.body;
            // Assuming req.body contains the data for the new game
            const newGameRef = await gamesCollection.add(newData);

            // Retrieve the automatically generated ID of the new game
            const newGameId = newGameRef.id;

            res.status(201).json(201); // Respond with the new game ID
        } catch (error) {
            console.error('Erreur lors de la création du match :', error);
            res.status(500).send('Internal Server Error');
        }
    }
};
