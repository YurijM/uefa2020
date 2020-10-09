const {Router} = require('express');
const stake = require('../controllers/stake.controller');
const router = Router();

// /api/stake
router.get('/loadStakesForGroups', stake.loadStakesForGroups);
router.get('/loadStakesForPlayoff', stake.loadStakesForPlayoff);

module.exports = router;
