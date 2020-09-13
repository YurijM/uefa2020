const {Router} = require('express');
const game = require('../controllers/game.controller');
const router = Router();

// /api/game
router.get('/loadGames', game.loadGames);
router.get('/addGame', game.addGame);
router.get('/updateGame', game.updateGame);
router.get('/deleteGame', game.deleteGame);
router.get('/addResultByAddTime', game.addResultByAddTime);
router.get('/deleteResultByAddTime', game.deleteResultByAddTime);
router.get('/addpenaltyTeam', game.addpenaltyTeam);
router.get('/deletepenaltyTeam', game.deletepenaltyTeam);

module.exports = router;
