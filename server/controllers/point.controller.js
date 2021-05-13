const pool = require('../middleware/database');

module.exports.loadPoints = async (req, res) => {
  const query = 'SELECT gambler_id, game_id, nickname, p.points, p.place, g.game_no\n' +
    'FROM points p\n' +
    'INNER JOIN games g ON g.id = p.game_id\n' +
    'INNER JOIN gamblers gm ON gm.id = p.gambler_id AND gm.status = 10\n' +
    'ORDER BY game_no'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.lastPlaces = async (req, res) => {
  const query = 'SELECT gambler_id, SUM(lastPlace) lastPlace, SUM(prevPlace) prevPlace FROM (\n' +
    'SELECT p.gambler_id, l.place lastPlace, 0 prevPlace\n' +
    'FROM points p\n' +
    'INNER JOIN games g ON g.id = p.game_id\n' +
    'INNER JOIN (\n' +
    'SELECT game_id, gambler_id, place FROM points WHERE game_id = ?\n' +
    ') l ON (l.game_id = p.game_id AND l.gambler_id = p.gambler_id)\n' +
    'UNION ALL\n' +
    'SELECT p.gambler_id, 0 lastPlace, pr.place prevPlace\n' +
    'FROM points p\n' +
    'INNER JOIN games g ON g.id = p.game_id\n' +
    'INNER JOIN (\n' +
    'SELECT game_id, gambler_id, place FROM points WHERE game_id = ?\n' +
    ') pr ON (pr.game_id = p.game_id AND pr.gambler_id = p.gambler_id)\n' +
    ') t\n' +
    'GROUP BY gambler_id'

  await pool.promise().execute(query, [
    req.query.lastGameId,
    req.query.prevGameId
  ])
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.lastGameIds = async (req, res) => {
  const query = 'SELECT game_id FROM points p\n' +
  'INNER JOIN games g ON g.id = p.game_id\n' +
  'GROUP BY game_id\n' +
  'ORDER BY game_no DESC\n' +
  'LIMIT 2'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.loadResult = async (req, res) => {
  const query = 'SELECT g.id AS gambler_id, nickname, sex, photo, SUM(IFNULL(p.points, 0)) points\n' +
    'FROM gamblers g\n' +
    'LEFT JOIN points p ON p.gambler_id = g.id\n' +
    /*'FROM points p\n' +
    'INNER JOIN gamblers g ON g.id = p.gambler_id\n' +*/
    'WHERE g.status = 10\n' +
    'GROUP BY gambler_id, nickname\n' +
    'ORDER BY points DESC, nickname'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.insertPoints = async (req, res) => {
  const query = 'INSERT INTO points SET game_id = ?, gambler_id = ?, points = ?, place = ?'

  await pool.promise().execute(query, [
    req.query.game_id,
    req.query.gambler_id,
    req.query.points,
    req.query.place
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: `Ошибка при вставки очков за игру (id=${req.query.game_id}) для игрока (id=${res.query.gambler_id} в таблицу points`})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.updatePoints = async (req, res) => {
  const query = 'UPDATE points SET points = ?, place = ? WHERE game_id = ? AND gambler_id = ?'

  await pool.promise().execute(query, [
    req.query.points,
    req.query.place,
    req.query.game_id,
    req.query.gambler_id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: `Ошибка при обновлении места после игры (id=${req.query.game_id}) для игрока (id=${res.query.gambler_id} в таблице points`})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
