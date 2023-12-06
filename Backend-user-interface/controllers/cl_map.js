const {db} = require('../db.js');
const {s3} = require("../s3");

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

exports.createMap = async (req, res, next) => {
    let response = req.file.location
    const userId = req.params.uid;
    res.send('Successfully uploaded ' + req.file.location + ' location!')
    const mapsCollection = db.collection(`users/${userId}/maps`);
    await mapsCollection.add({
        url: response
    })
        .then(() => {
            console.log('Élément ajouté avec succès dans le tableau "maps" pour le user ' + userId);
        })
        .catch((error) => {
            console.error('Erreur lors de l\'ajout du document :', error);
        });
};

exports.deleteMap = async (req, res) => {
    const userId = req.params.uid;
    const filename = req.params.filename;

    // Supprimer l'objet du bucket S3
    await s3.deleteObject({Bucket: "roommappingbucket", Key: filename}).promise();

    // Supprimer l'entrée correspondante dans Cloud Firestore
    const mapsCollection = db.collection(`users/${userId}/maps`);
    const query = mapsCollection.where('url', '==', "https://roommappingbucket.s3.eu-north-1.amazonaws.com/" + filename);
    const snapshot = await query.get();

    if (snapshot.empty) {
        // Aucune correspondance trouvée dans Cloud Firestore
        return res.status(404).send("File not found in Cloud Firestore");
    }

    // Supprimer l'entrée dans Cloud Firestore
    const batch = db.batch();
    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Effectue tout le batch en une fois
    await batch.commit();

    res.send("File Deleted Successfully");
};