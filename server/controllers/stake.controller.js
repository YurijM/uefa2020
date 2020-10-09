const pool = require('../middleware/database');

module.exports.loadStakesForPlayoff = async (req, res) => {
  const query = 'SELECT g.id, ' +
    'g.`start`, g.game_no, s.city, gr.`order`, gr.`group`, ' +
    't1.flag flag1, t1.team team1, t2.flag flag2, t2.team team2, ' +
    'IFNULL(stakes.goal1, \'\') goal1, IFNULL(stakes.goal2, \'\') goal2, ' +
    'IFNULL(sa.goal1, \'\') addGoal1, IFNULL(sa.goal2, \'\') addGoal2, ' +
    'IFNULL(sp.team_id, 0) penaltyId, IFNULL(sp.team, \'\') penaltyTeam ' +
    'FROM games g ' +
    'LEFT JOIN `groups` gr ON gr.id = g.group_id ' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id ' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id ' +
    'LEFT JOIN stadiums s ON s.id = g.stadium_id ' +
    'LEFT JOIN stakes ON stakes.gambler_id = ? AND stakes.game_id = g.id ' +
    'LEFT JOIN `stakes-addtime` sa ON sa.stake_id = stakes.id ' +
    'LEFT JOIN ' +
    '(SELECT sp.stake_id, sp.team_id, t.team FROM `stakes-penalty` sp LEFT JOIN teams t ON t.id = sp.team_id) ' +
    'sp ON sp.stake_id = stakes.id ' +
    'WHERE `start` > NOW() AND gr.`order` > ? ' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query, [
    req.query.id,
    req.query.order
  ])
  .then(async ([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.loadStakesForGroups = async (req, res) => {
  const query = 'SELECT g.id, ' +
    'g.`start`, g.game_no, s.city, gr.`order`, gr.`group`, ' +
    't1.flag flag1, t1.team team1, t2.flag flag2, t2.team team2, ' +
    'IFNULL(stakes.goal1, \'\') goal1, IFNULL(stakes.goal2, \'\') goal2 ' +
    'FROM games g ' +
    'LEFT JOIN `groups` gr ON gr.id = g.group_id ' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id ' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id ' +
    'LEFT JOIN stadiums s ON s.id = g.stadium_id ' +
    'LEFT JOIN stakes ON stakes.gambler_id = ? AND stakes.game_id = g.id ' +
    'WHERE `start` > NOW() AND gr.`order` <= ? ' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query, [
    req.query.id,
    req.query.order
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

