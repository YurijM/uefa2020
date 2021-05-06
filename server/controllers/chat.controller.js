const pool = require('../middleware/database');

module.exports.loadGamblers = async (req, res) => {
  //const query = 'SELECT * FROM gamblers WHERE `connected` = 1 ORDER BY nickname';
  const query = 'SELECT * FROM gamblers WHERE `socket_id` <> \'\' ORDER BY nickname';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.loadMessages = async (req, res) => {
  let where = '';
  if (parseInt(req.query.range) > 0) {
      where = `WHERE \`date\` > DATE_SUB(CURDATE(), INTERVAL ${req.query.range} DAY) `;
  }

  if (req.query.system != 'true') {
    where += (where === '' ? 'WHERE ' : 'AND ') + '`from` > 0 '
  }

  const query = 'SELECT IFNULL(g.id, 0) AS `fromId`, ' +
    'IFNULL(g.nickname, \'администратор\') AS `fromNick`, ' +
    'IFNULL(g.photo, \'\') AS `photo`, m.message, m.date, ' +
    'm.quoteNick, m.quoteDate, m.quoteText ' +
    'FROM messages m ' +
    'LEFT JOIN gamblers g ON m.`from` = g.id ' +
    where +
    'ORDER BY m.date';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
      res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.saveMessage = async (req, res) => {
  const query = 'INSERT INTO messages\n' +
    '(`from`, `to`, `message`, `date`, `quoteNick`, `quoteDate`, `quoteText`)\n' +
    'VALUES (?, ?, ?, ?, ?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.from,
    req.query.to,
    req.query.message,
    req.query.date,
    req.query.quoteNick,
    req.query.quoteDate,
    req.query.quoteText
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при добавлении нового сообщения в таблицу messages'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.updateMessage = async (req, res) => {
  const query = 'UPDATE messages SET `message` = ?, `date` = ? WHERE `from` = ? AND `date` = ?';

  await pool.promise().execute(query, [
    req.query.message,
    req.query.date,
    req.query.fromId,
    req.query.date,
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении сообщения в таблице messages'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteMessage = async (req, res) => {
  const query = 'DELETE FROM messages WHERE `from` = ? AND `date` = ?';

  await pool.promise().execute(query, [
    req.query.fromId,
    req.query.date,
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении сообщения из таблицы messages'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}

