const {upload} = require('../s3.js');
const {db} = require('../db.js');
const {FieldValue} = require("firebase-admin/firestore");
const {type} = require("http-errors");

exports.getGames = async (req, res) => {
    console.log("Called")
    try {
        const gamesCollection = db.collection(`users/${req.params.uid}/maps/${req.params.mid}/games`);

        const snapshot = await gamesCollection.get();

        const games = [];

        snapshot.forEach((doc) => {
            const gameData = doc.data();

            games.push({
                gameId: doc.id,
                ...gameData
            });
        });

        res.status(200).json(games);
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
            errors.push("userId must be a string and not empty");
        }
        if (typeof req.body.mapId !== "string" || req.body.mapId === "") {
            errors.push("mapId must not be empty and must be a string");
        }
        if (typeof req.body.name !== "string" || req.body.name.length === 0 || req.body.name.length >= 300) {
            errors.push("name must be a non-empty string and less than 300 characters");
        }
        if (typeof req.body.date !== "string" || isNaN(new Date(req.body.date).getTime()) || new Date(req.body.date) <= new Date()) {
            errors.push("date must be a string, must be in a date format, and must be in the future");
        }
        if (!Array.isArray(req.body.teams) || req.body.teams.length < 2) {
            errors.push("teams must be an array and must contain at least 2 teams");
        } else {
            req.body.teams.forEach((team, index) => {
                if (typeof team.name !== "string" || team.name === "" || team.name.length >= 100) {
                    errors.push(`teams[${index}].name must be a string between 1 and 100 characters`);
                }
                if (typeof team.roomId !== "string" || team.roomId.length !== 6) {
                    errors.push(`teams[${index}].roomId must be a string of 6 characters`);
                }
            });
        }
        if (errors.length === 0) {
            return true;
        } else {
            res.status(422).json({errors});
            return false;
        }
    }


    if (dataVerification()) {
        try {
            const gamesCollection = db.collection(`users/${req.body.userId}/maps/${req.body.mapId}/games`);
            const {userId, mapId, ...newData} = req.body;

            const newGameRef = await gamesCollection.add(newData);

            const newGameId = newGameRef.id;

            res.status(201).json(201);
        } catch (error) {
            console.error('Erreur lors de la création du match :', error);
            res.status(500).send('Internal Server Error');
        }
    }
};
