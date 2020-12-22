const {Router} = require('express')
const point = require('../controllers/point.controller')
const router = Router()

// /api/point
router.get('/loadPoints', point.loadPoints)
router.get('/insertPoints', point.insertPoints)
router.get('/updatePoints', point.updatePoints)

module.exports = router
