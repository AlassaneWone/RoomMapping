var R_qrcode = require('qrcode');
const { db } = require('../db.js');

exports.publish = async (req, res, next) => {
    //generate url
    url = `${process.env.URL}/map/?type=${req.body.type}&mapid=${req.body.mid}`
    //transform url into qrcode
    var code = R_qrcode.toString(url, {errorCorrectionLevel: 'H', type:'svg'}, function(err, data){
        if (err) throw err;
    })
    //set published flag to true
    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'published':true, 'qrcode':code})
}

exports.unPublish = async (req, res, next) => {
    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'published':false})
}

exports.modifyParams = async (req, res, next) => {
    url = `${process.env.URL}/map/?type=${req.body.type}&mapid=${req.body.mid}`
    console.log(url)
    var code = R_qrcode.toString(url, {errorCorrectionLevel: 'H', type:'svg'}, function(err, data){
        if (err) throw err;
    })

    documentref = db.collection(`users/${req.body.uid}/maps`).doc(req.body.mid)
    documentref.update({'qrcode':code})
}