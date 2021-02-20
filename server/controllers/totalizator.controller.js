const pool = require('../middleware/database');

module.exports.loadGamblers = async(req, res) => {
  const query = 'SELECT id, nickname\n' +
    'FROM gamblers\n' +
    'WHERE `status` > 1\n' +
    'ORDER BY nickname;'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
module.exports.loadPoints = async(req, res) => {
  const query = 'SELECT * FROM points\n' +
    'WHERE game_id IN (' + req.query.gameIds + ');'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
module.exports.loadStakes = async(req, res) => {
  const query = 'SELECT s.id, s.game_id, s.gambler_id,\n' +
    'IF(NOT ISNULL(s.goal1), CONCAT(s.goal1, \':\', s.goal2), \'\') result,  \n' +
    'IF(NOT ISNULL(sa.goal1), CONCAT(sa.goal1, \':\', sa.goal2), \'\') addResult,\n' +
    'IF(NOT ISNULL(sp.team_id), t.team, \'\') penaltyWin  \n' +
    'FROM stakes s\n' +
    'LEFT JOIN `stakes-addtime` sa ON sa.stake_id = s.id\n' +
    'LEFT JOIN `stakes-penalty` sp ON sp.stake_id = s.id\n' +
    'LEFT JOIN teams t ON t.id = sp.team_id\n' +
    'WHERE s.game_id IN (' + req.query.gameIds + ')\n' +
    'ORDER BY s.game_id;'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
module.exports.loadGames = async (req, res) => {
  const query = 'SELECT g.id, g.game_no, gr.group,\n' +
    'CONCAT(t1.team, \'-\', t2.team) game,\n' +
    'CONCAT(IFNULL(g.goal1, \'0\'), \':\', IFNULL(g.goal2, \'0\')) AS `result`,\n' +
    'IF(NOT ISNULL(a.goal1), CONCAT(a.goal1, \':\', a.goal2), \'\') addResult,\n' +
    'IFNULL(tp.team, \'\') penaltyWin\n' +
    'FROM games g\n' +
    'LEFT JOIN groups gr ON gr.id = g.group_id\n' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id\n' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id\n' +
    'LEFT JOIN addtime a ON a.game_id = g.id \n' +
    'LEFT JOIN penalty p ON p.game_id = g.id \n' +
    'LEFT JOIN teams tp ON tp.id = p.team_id \n' +
    'WHERE g.`start` <= CURRENT_TIMESTAMP\n' +
    'ORDER BY g.game_no DESC';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};
