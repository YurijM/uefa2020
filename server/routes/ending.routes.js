const {Router} = require('express');
const ending = require('../controllers/ending.controller');

const router = Router();

// /api/ending
router.get('/loadEnding', ending.loadEnding);
router.get('/updateEnding', ending.updateEnding);

module.exports = router;
