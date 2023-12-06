const { upload, s3 } = require('../s3.js');
const { db } = require('../db.js');
const express = require('express');
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.delete("/:userId/:filename", async (req, res) => {
    const userId = req.params.userId;
    const filename = req.params.filename;

    // Supprimer l'objet du bucket S3
    await s3.deleteObject({ Bucket: "roommappingbucket", Key: filename }).promise();

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
});

module.exports = router;