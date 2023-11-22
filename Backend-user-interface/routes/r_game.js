const userCtrl = require('../controllers/cl_game')
const express = require("express");
const router = express.Router();

router.get('/:uid/:mid', userCtrl.getGames)
router.get('/:uid/:mid/:gid', userCtrl.getGame)
router.post('/', userCtrl.createGame)

module.exports = router;
