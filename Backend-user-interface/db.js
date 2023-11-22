const admin = require("firebase-admin");
const serviceAccount = require(process.env.SERVICE_ACCOUNT);
const {getFirestore} = require("firebase-admin/firestore");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://roommapping-airsoft-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = getFirestore()

module.exports = {db};