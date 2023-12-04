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
        console.log(mapsList)

        res.status(200).json(mapsList);
    } catch (error) {
        console.error('Erreur lors de la récupération des parties :', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getMap = async (req, res, next) => {
    try {
        const mapDoc = db.doc(`users/${req.params.uid}/maps/${req.params.mapId}`);
        const mapSnapshot = await mapDoc.get();


        if (!mapSnapshot.exists) {
            return res.status(404).send('Map not found');
        }

        const map = mapSnapshot.data();

        res.status(200).json(map);
    } catch (error) {
        console.error('Erreur lors de la récupération de la carte :', error);
        res.status(500).send('Internal Server Error');
    }
};