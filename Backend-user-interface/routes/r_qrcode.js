var express = require('express')
var router = express.Router();
const qrCtrl = require('../controllers/cl_qrcode')
require('dotenv').config()


router.post('/', qrCtrl.publish)

router.delete('/', qrCtrl.unPublish)

router.put('/', qrCtrl.modifyParams)

module.exports = router;