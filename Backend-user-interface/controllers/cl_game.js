const { upload } = require('../s3.js');
const { db } = require('../db.js');
const {FieldValue} = require("firebase-admin/firestore");

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
    const mapsCollection = db.collection(`users/${userId}/maps`);
    const gameCollection = mapsCollection.doc(mapId).collection('games');
};

exports.createGame = async (req, res) => {
    console.log("Called")
    try {
        const gamesCollection = db.collection(`users/${req.body.userId}/maps/${req.body.mapId}/games`);
        const { userId, mapId, ...newData } = req.body;
        // Assuming req.body contains the data for the new game
        const newGameRef = await gamesCollection.add(newData);

        // Retrieve the automatically generated ID of the new game
        const newGameId = newGameRef.id;

        res.status(201).json({ gameId: newGameId }); // Respond with the new game ID
    } catch (error) {
        console.error('Erreur lors de la création du match :', error);
        res.status(500).send('Internal Server Error');
    }
};
