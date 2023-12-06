const userCtrl = require('../controllers/cl_map')
const express = require("express");
const { upload } = require('../s3.js');
const router = express.Router();

router.get('/:uid', userCtrl.getMaps)
router.get('/:uid/maps/:mapId', userCtrl.getMap)
router.post('/:uid', upload.single('file'), userCtrl.createMap)
router.delete('/:uid/:filename', userCtrl.deleteMap)

module.exports = router;