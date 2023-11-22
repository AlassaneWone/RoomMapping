const { upload, s3 } = require('../s3.js');
const { db } = require('../db.js');
const express = require('express');
const {FieldValue} = require("firebase-admin/firestore");
const router = express.Router();

router.delete("/:filename", async (req, res) => {
    const filename = req.params.filename
    await s3.deleteObject({ Bucket: "roommappingbucket", Key: filename }).promise();
    res.send("File Deleted Successfully")

})

module.exports = router;