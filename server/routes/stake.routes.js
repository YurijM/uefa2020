const {Router} = require('express');
const stake = require('../controllers/stake.controller');
const router = Router();

// /api/stake
router.get('/loadStakesForGroups', stake.loadStakesForGroups)
router.get('/loadStakesForPlayoff', stake.loadStakesForPlayoff)
router.get('/addStake', stake.addStake)
router.get('/updateStake', stake.updateStake)
router.get('/addStakeAddTime', stake.addStakeAddTime)
router.get('/addPenaltyTeam', stake.addPenaltyTeam)
router.get('/deleteStakeAddTime', stake.deleteStakeAddTime)
router.get('/deletePenaltyTeam', stake.deletePenaltyTeam)

module.exports = router;
