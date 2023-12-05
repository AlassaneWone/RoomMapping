var express = require('express')
var router = express.Router();
var QRCode = require('qrcode');
const { db } = require('../db.js');
require('dotenv').config()


router.post('/',async (req, res, next) => {
    //generate url
    url = `${process.env.URL}/map/?type=${req.body.type}&mapid=${req.body.mid}`
    //transform url into qrcode
    var code = QRCode.toString(url, {errorCorrectionLevel: 'H', type:'svg'}, function(err, data){
        if (err) throw err;
    })
    //set published flag to true
    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'published':true, 'qrcode':code})
});

router.delete('/', async (req, res, next) => {
    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'published':false})
})

router.put('/', async (req, res, next) => {
    url = `${process.env.URL}/map/?type=${req.body.type}&mapid=${req.body.mid}`
    console.log(url)
    var code = QRCode.toString(url, {errorCorrectionLevel: 'H', type:'svg'}, function(err, data){
        if (err) throw err;
    })

    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'qrcode':code})
})

module.exports = router;