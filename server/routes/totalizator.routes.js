const {Router} = require('express')
const totalizator = require('../controllers/totalizator.controller')

const router = Router()

// /api/totalizator
router.get('/loadGamblers', totalizator.loadGamblers)
router.get('/loadGames', totalizator.loadGames)
router.get('/loadPoints', totalizator.loadPoints)
router.get('/loadStakes', totalizator.loadStakes)

module.exports = router
