const pool = require('../middleware/database');

module.exports.loadGroups = async (req, res) => {
  const query = 'SELECT * FROM `groups` ORDER BY `order`';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.addGroup = async (req, res) => {
  const query = 'INSERT INTO `groups` (`group`, `order`) VALUES (?, ?)';

  await pool.promise().execute(query, [
    req.query.group,
    req.query.order
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при добавлении новой группы в таблицу groups'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.updateGroup = async (req, res) => {
  const query = 'UPDATE `groups` SET `group` = ?, `order` = ? WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.group,
    req.query.order,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении группы в таблице groups'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteGroup = async (req, res) => {
  const query = 'DELETE FROM `groups` WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении группы из таблицы groups'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
