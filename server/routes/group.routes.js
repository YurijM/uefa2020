const {Router} = require('express');
const group = require('../controllers/group.controller');

const router = Router();

// /api/group
router.get('/loadGroups', group.loadGroups);
router.get('/saveGroup', group.saveGroup);
router.get('/updateGroup', group.updateGroup);
router.get('/deleteGroup', group.deleteGroup);

module.exports = router;
