const pool = require('../middleware/database');
const nodemailer = require('nodemailer');
module.exports.loadEnding = async(req, res) => {
  const query = 'SELECT `id`, `finish`, `message` FROM `ending` LIMIT 1'

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

module.exports.updateEnding = async (req, res) => {
  const query = 'UPDATE `ending`\n' +
    'SET `finish` = ?, `message` = ?\n' +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.finish,
    req.query.message,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении таблицы ending'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
