const pool = require('../middleware/database');

module.exports.loadGames = async (req, res) => {
  const query = 'SELECT g.id, g.stadium_id, g.group_id, g.team1_id, g.team2_id, ' +
    'g.`start`, g.game_no, s.city, s.stadium, s.image, gr.`group`, ' +
    't1.flag flag1, t1.team team1, t2.flag flag2, t2.team team2, ' +
    'IFNULL(g.goal1, \'\') goal1, IFNULL(g.goal2, \'\') goal2, ' +
    'IFNULL(a.goal1, \'\') addGoal1, IFNULL(a.goal2, \'\') addGoal2, ' +
    'IFNULL(p.team_id, 0) penaltyId, IFNULL(p.team, \'\') penaltyTeam ' +
    'FROM games g ' +
    'LEFT JOIN `groups` gr ON gr.id = g.group_id ' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id ' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id ' +
    'LEFT JOIN stadiums s ON s.id = g.stadium_id ' +
    'LEFT JOIN addtime a ON a.game_id = g.id ' +
    'LEFT JOIN ' +
    '(SELECT p.game_id, p.team_id, t.team FROM penalty p LEFT JOIN teams t ON t.id = p.team_id) ' +
    'p ON p.game_id = g.id ' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.addGame = async (req, res) => {
  const query = 'INSERT INTO `games` ' +
    '(`start`, `game_no`, `stadium_id`, `group_id`, `team1_id`, `team2_id`, `goal1`, `goal2`) ' +
    `VALUES (?, ?, ?, ?, ?, ?, ${!req.query.goal1 ? 'NULL' : req.query.goal1}, ${!req.query.goal2 ? 'NULL' : req.query.goal2})`;

  await pool.promise().execute(query, [
    req.query.start,
    req.query.game_no,
    req.query.stadium_id,
    req.query.group_id,
    req.query.team1_id,
    req.query.team2_id
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении новой игры в таблицу games'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.updateGame = async (req, res) => {
  const query = 'UPDATE `games` ' +
    'SET `start` = ?, `game_no` = ?, `stadium_id` = ?, `group_id` = ?, `team1_id` = ?, `team2_id` = ?, ' +
    '`goal1` = ' + `${!req.query.goal1 ? 'NULL' : req.query.goal1}, ` +
    '`goal2` = ' + `${!req.query.goal2 ? 'NULL' : req.query.goal2} ` +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.start,
    req.query.game_no,
    req.query.stadium_id,
    req.query.group_id,
    req.query.team1_id,
    req.query.team2_id,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении игры в таблице games'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteGame = async (req, res) => {
  const query = 'DELETE FROM `games` WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении игры из таблицы games'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.addResultByAddTime = async (req, res) => {
  const query = 'INSERT INTO `addtime` ' +
    '(`game_id`, `goal1`, `goal2`) ' +
    'VALUES (?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.id,
    req.query.goal1,
    req.query.goal2
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении нового результата в таблицу addtime'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteResultByAddTime = async (req, res) => {
  const query = 'DELETE FROM `addtime` WHERE `game_id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении результата из таблицы addtime'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.addPenaltyTeam = async (req, res) => {
  const query = 'INSERT INTO `penalty` ' +
    '(`game_id`, `team_id`) ' +
    'VALUES (?, ?)';

  await pool.promise().execute(query, [
    req.query.game_id,
    req.query.team_id
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении нового победителя по пенальти в таблицу penalty'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deletepenaltyTeam = async (req, res) => {
  const query = 'DELETE FROM `penalty` WHERE `game_id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении победителя по пенальти из таблицы penalty'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
