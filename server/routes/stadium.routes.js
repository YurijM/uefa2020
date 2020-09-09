const {Router} = require('express');
const stadium = require('../controllers/stadium.controller');
const router = Router();
const upload = require('../middleware/upload');

// /api/stadium
router.get('/loadStadiums', stadium.loadStadiums);
router.get('/addStadium', stadium.addStadium);
router.get('/deleteImage', stadium.deleteImage);
router.post('/updateImage',
  upload.single('file'),
  stadium.updateImage
);
router.get('/updateStadium', stadium.updateStadium);
router.get('/deleteStadium', stadium.deleteStadium);

module.exports = router;
