const pool = require('../middleware/database');

module.exports.loadGames = async (req, res) => {
  const query = 'SELECT g.id, g.stadium_id, g.group_id, g.team1_id, g.team2_id, ' +
    'g.`start`, g.game_no, s.city, s.stadium, s.image, gr.`group`, gr.`order`, ' +
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
}

module.exports.loadGamesForTeam = async (req, res) => {
  const query = 'SELECT team1_id, team2_id, t1.team team1, t2.team team2,\n' +
    'IFNULL(g.goal1, \'\') goal1, IFNULL(g.goal2, \'\') goal2,\n' +
    'IFNULL(a.goal1, \'\') addGoal1, IFNULL(a.goal2, \'\') addGoal2, IFNULL(p.team, \'\') penaltyTeam\n' +
    'FROM games g\n' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id\n' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id\n' +
    'LEFT JOIN addtime a ON a.game_id = g.id\n' +
    'LEFT JOIN\n' +
    '(SELECT p.game_id, t.team FROM penalty p LEFT JOIN teams t ON t.id = p.team_id)\n' +
    'p ON p.game_id = g.id\n' +
    //'WHERE `start` < NOW() AND (team1_id = ? OR team2_id = ?)\n' +
    'WHERE team1_id = ? OR team2_id = ?\n' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query, [
    req.query.team_id,
    req.query.team_id
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.loadGame = async (req, res) => {
  const query = 'SELECT IFNULL(g.goal1, \'\') goal1, IFNULL(g.goal2, \'\') goal2, ' +
    'IFNULL(ad.goal1, \'\') addGoal1, IFNULL(ad.goal2, \'\') addGoal2, ' +
    'IFNULL(p.team_id, 0) penaltyId ' +
    'FROM games g ' +
    'LEFT JOIN addtime ad ON ad.game_id = g.id ' +
    'LEFT JOIN penalty p ON p.game_id = g.id ' +
    'WHERE id = ?'

  await pool.promise().execute(query, [
    req.query.game_id
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.loadPlayoffGames = async (req, res) => {
  const query = 'SELECT g.`start`, gr.id AS groupId, gr.`group`,\n' +
    'CONCAT(t1.team, \':\', t2.team) AS game,\n' +
    't1.flag AS flag1, t2.flag AS flag2,\n' +
    'CONCAT(g.goal1, \':\', g.goal2, IFNULL(CONCAT(\', доп.время \', `at`.goal1, \':\', `at`.goal2), \'\'), IFNULL(CONCAT(\', по пенальти \',' +
    ' t3.team), \'\')) AS result\n' +
    'FROM games g\n' +
    'INNER JOIN `groups` gr ON gr.id = group_id\n' +
    'INNER JOIN teams t1 ON t1.id = g.team1_id\n' +
    'INNER JOIN teams t2 ON t2.id = g.team2_id\n' +
    'LEFT JOIN addtime `at` ON `at`.game_id = g.id\n' +
    'LEFT JOIN penalty p ON p.game_id = g.id\n' +
    'LEFT JOIN teams t3 ON t3.id = p.team_id\n' +
    'WHERE gr.`order` > ? AND (g.goal1 IS NOT NULL)\n' +
    'ORDER BY g.game_no DESC'

  await pool.promise().execute(query, [
    req.query.countGroups
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

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

module.exports.deletePenaltyTeam = async (req, res) => {
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
