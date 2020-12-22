const {Router} = require('express');
const game = require('../controllers/game.controller');
const router = Router();

// /api/game
router.get('/loadGames', game.loadGames);
router.get('/loadGame', game.loadGame);
router.get('/loadGamesForTeam', game.loadGamesForTeam);
router.get('/addGame', game.addGame);
router.get('/updateGame', game.updateGame);
router.get('/deleteGame', game.deleteGame);
router.get('/addResultByAddTime', game.addResultByAddTime);
router.get('/deleteResultByAddTime', game.deleteResultByAddTime);
router.get('/addPenaltyTeam', game.addPenaltyTeam);
router.get('/deletePenaltyTeam', game.deletePenaltyTeam);

module.exports = router;
