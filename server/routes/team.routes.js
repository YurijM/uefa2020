const {Router} = require('express');
const team = require('../controllers/team.controller');
const router = Router();
const upload = require('../middleware/upload');

// /api/team
router.get('/loadTeams', team.loadTeams);
router.get('/addTeam', team.addTeam);
router.get('/deleteFlag', team.deleteFlag);
router.post('/updateFlag',
  upload.single('file'),
  team.updateFlag
);
router.get('/updateTeam', team.updateTeam);
//router.get('/updatePlace', team.updatePlace);
router.get('/deleteTeam', team.deleteTeam);

module.exports = router;
