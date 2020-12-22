const pool = require('../middleware/database');

module.exports.loadPoints = async (req, res) => {
  const query = 'SELECT gambler_id, game_id, points, place, g.game_no ' +
    'FROM points p ' +
    'INNER JOIN games g ON g.id = p.game_id ' +
    'ORDER BY game_no'

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
