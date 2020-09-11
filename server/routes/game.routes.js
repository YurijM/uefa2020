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
router.get('/addWinByPenalty', game.addWinByPenalty);
router.get('/deleteWinByPenalty', game.deleteWinByPenalty);

module.exports = router;
