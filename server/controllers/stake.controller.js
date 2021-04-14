const pool = require('../middleware/database')

module.exports.loadStakesPlayoff = async (req, res) => {
  const query = 'SELECT g.id AS gameId, stakes.id AS stakeId, g.team1_id, g.team2_id,\n' +
    'g.`start`, g.game_no, s.city, gr.`order`, gr.`group`,\n' +
    't1.flag flag1, t1.team team1, t1.group_id AS group1, t2.flag flag2, t2.team team2, t2.group_id AS group2,\n' +
    'IFNULL(stakes.goal1, \'\') goal1, IFNULL(stakes.goal2, \'\') goal2,\n' +
    'IFNULL(sa.goal1, \'\') addGoal1, IFNULL(sa.goal2, \'\') addGoal2,\n' +
    'IFNULL(sp.team_id, 0) penaltyId, IFNULL(sp.team, \'\') penaltyTeam\n' +
    'FROM games g\n' +
    'LEFT JOIN `groups` gr ON gr.id = g.group_id\n' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id\n' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id\n' +
    'LEFT JOIN stadiums s ON s.id = g.stadium_id\n' +
    'LEFT JOIN stakes ON stakes.gambler_id = ? AND stakes.game_id = g.id\n' +
    'LEFT JOIN `stakes-addtime` sa ON sa.stake_id = stakes.id\n' +
    'LEFT JOIN\n' +
    '(SELECT sp.stake_id, sp.team_id, t.team FROM `stakes-penalty` sp LEFT JOIN teams t ON t.id = sp.team_id)\n' +
    'sp ON sp.stake_id = stakes.id\n' +
    'WHERE `start` > NOW() AND gr.`order` > ?\n' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query, [
    req.query.gambler_id,
    req.query.order
  ])
  .then(async ([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.loadStakesGroups = async (req, res) => {
  const query = 'SELECT g.id AS gameId, stakes.id AS stakeId,\n' +
    'DATE_FORMAT(g.`start`,\'%d.%m.%Y\') AS startDate, g.`start`, g.game_no,\n' +
    's.city, s.stadium, s.image AS stadiumImage, gr.id AS groupId, gr.`order`, gr.`group`,\n' +
    't1.flag flag1, t1.team team1, t2.flag flag2, t2.team team2,\n' +
    'IFNULL(stakes.goal1, \'\') goal1, IFNULL(stakes.goal2, \'\') goal2\n' +
    'FROM games g\n' +
    'LEFT JOIN `groups` gr ON gr.id = g.group_id\n' +
    'LEFT JOIN teams t1 ON t1.id = g.team1_id\n' +
    'LEFT JOIN teams t2 ON t2.id = g.team2_id\n' +
    'LEFT JOIN stadiums s ON s.id = g.stadium_id\n' +
    'LEFT JOIN stakes ON stakes.gambler_id = ? AND stakes.game_id = g.id\n' +
    'WHERE `start` > NOW() AND gr.`order` <= ?\n' +
    'ORDER BY g.game_no'

  await pool.promise().execute(query, [
    req.query.gambler_id,
    req.query.order
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.loadStakesGame = async (req, res) => {
  /* const query = 'SELECT gambler_id, ' +
       'IFNULL(s.goal1, \'\') goal1, IFNULL(s.goal2, \'\') goal2, ' +
       'IFNULL(sa.goal1, \'\') addGoal1, IFNULL(sa.goal2, \'\') addGoal2, ' +
       'IFNULL(sp.team_id, 0) penaltyId ' +
       'FROM stakes s ' +
       'LEFT JOIN `stakes-addtime` sa ON sa.stake_id = s.id ' +
       'LEFT JOIN `stakes-penalty` sp ON sp.stake_id = s.id ' +
       'WHERE game_id = ?'*/
  const query = 'SELECT g.id AS gambler_id,\n' +
    'IFNULL(s.goal1, \'\') goal1, IFNULL(s.goal2, \'\') goal2,\n' +
    'IFNULL(sa.goal1, \'\') addGoal1, IFNULL(sa.goal2, \'\') addGoal2,\n' +
    'IFNULL(sp.team_id, 0) penaltyId\n' +
    'FROM gamblers g\n' +
    'LEFT JOIN stakes s ON s.gambler_id = g.id AND s.game_id = ?\n' +
    'LEFT JOIN `stakes-addtime` sa ON sa.stake_id = s.id\n' +
    'LEFT JOIN `stakes-penalty` sp ON sp.stake_id = s.id\n' +
    'WHERE g.status = 10\n'

  await pool.promise().execute(query, [
    req.query.gameId
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.addStake = async (req, res) => {
  const query = 'INSERT INTO `stakes` ' +
    '(`game_id`, `gambler_id`, `goal1`, `goal2`) ' +
    `VALUES (?, ?, ?, ?)`

  await pool.promise().execute(query, [
    req.query.game_id,
    req.query.gambler_id,
    req.query.goal1,
    req.query.goal2
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении новой ставки в таблицу games'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.updateStake = async (req, res) => {
  const query = 'UPDATE `stakes` SET\n' +
    'goal1 = ?, goal2 = ?\n' +
    'WHERE id = ?'

  await pool.promise().execute(query, [
    req.query.goal1,
    req.query.goal2,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json({rows: !!result[0]})
    } else {
      res.json({error: 'Ошибка при добавлении новой ставки в таблицу games'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.addStakeAddTime = async (req, res) => {
  const query = 'INSERT INTO `stakes-addtime` ' +
    '(`stake_id`, `goal1`, `goal2`) ' +
    'VALUES (?, ?, ?)'

  await pool.promise().execute(query, [
    req.query.stake_id,
    req.query.goal1,
    req.query.goal2
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении ставки в дополнительное время в таблицу stakes-addtime'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.addPenaltyTeam = async (req, res) => {
  const query = 'INSERT INTO `stakes-penalty` ' +
    '(`stake_id`, `team_id`) ' +
    'VALUES (?, ?)'

  await pool.promise().execute(query, [
    req.query.stake_id,
    req.query.team_id
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении ставки на победителя по пенальти в таблицу stakes-penalty'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.deleteStakeAddTime = async (req, res) => {
  const query = 'DELETE FROM `stakes-addtime` WHERE `stake_id` = ?'

  await pool.promise().execute(query, [
    req.query.stake_id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении ставки в дополнительное время из таблицы stake-addtime'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.deletePenaltyTeam = async (req, res) => {
  const query = 'DELETE FROM `stakes-penalty` WHERE `stake_id` = ?'

  await pool.promise().execute(query, [
    req.query.stake_id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении ставки победителя по пенальти из таблицы stake-penalty'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
module.exports.loadStakesNear = async (req, res) => {
  const query = 'SELECT gm.nickname, IFNULL(CONCAT(s.goal1, \' : \', s.goal2), \'нет\') AS result\n' +
    'FROM gamblers gm\n' +
    'LEFT JOIN (\n' +
    'SELECT s.*, g.`start` FROM stakes s\n' +
    'INNER JOIN (\n' +
    'SELECT id, `start` FROM games\n' +
    'WHERE `start` > NOW()\n' +
    'ORDER BY `start`\n' +
    'LIMIT 1) g ON g.id = s.game_id\n' +
    ') s ON s.gambler_id = gm.id\n' +
    'ORDER BY nickname'

  await pool.promise().execute(query, [])
  .then(async ([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
