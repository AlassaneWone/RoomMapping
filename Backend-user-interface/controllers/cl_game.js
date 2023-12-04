const {db} = require('../db.js');

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