const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");
const dotenv = require('dotenv')
const serviceAccountContentString = process.env.SERVICE_ACCOUNT;
const serviceAccount = JSON.parse(serviceAccountContentString);

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://roommapping-airsoft-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = getFirestore()

module.exports = {db};