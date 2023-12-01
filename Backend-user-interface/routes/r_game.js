const userCtrl = require('../controllers/cl_game')
const express = require("express");
const router = express.Router();

router.get('/:uid/:mid', userCtrl.getGames)

module.exports = router;
