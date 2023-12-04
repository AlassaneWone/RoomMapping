const {db} = require('../db.js');

exports.getMaps = async (req, res, next) => {
    try {
        const mapCollection = db.collection(`users/${req.params.uid}/maps`);
        const snapshot = await mapCollection.get();
        const mapsList = [];
        snapshot.forEach((doc) => {
            const gameData = doc.data();
            
            mapsList.push({
                mapId: doc.id,
                ...gameData
            });
        });

        res.status(200).json(mapsList);
    } catch (error) {
        console.error('Erreur lors de la récupération des parties :', error);
        res.status(500).send('Internal Server Error');
    }
};