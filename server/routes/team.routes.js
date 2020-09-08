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
router.get('/updateTeamPlace', team.updateTeamPlace);
router.get('/deleteTeam', team.deleteTeam);

module.exports = router;
