const { upload } = require('../s3.js');
const { db } = require('../db.js');
const express = require('express');
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.post('/:userId/upload', upload.single('file'), async function (req, res, next) {

    let response = req.file.location
    const userId = req.params.userId;
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
})

module.exports = router;