const express = require('express');
const router = express.Router();
const { createGame , getGame  , updateGameScore , concludeGameAndAnnounceResults} = require("../controllers/gameControllers");


router.post("/startNew", createGame);
router.get('/:gameId' , getGame);
router.post('/:gameId/score', updateGameScore);
router.post('/:gameId/end', concludeGameAndAnnounceResults);

module.exports = router;