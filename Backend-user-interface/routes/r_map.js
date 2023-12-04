const userCtrl = require('../controllers/cl_map')
const express = require("express");
const router = express.Router();

router.get('/:uid', userCtrl.getMaps)

router.get('/:uid/maps/:mapId', userCtrl.getMap)

module.exports = router;