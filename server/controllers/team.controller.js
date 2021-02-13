const pool = require('../middleware/database');
const path = require('path');
const fs = require('fs');

module.exports.loadTeams = async (req, res) => {
  const query = 'SELECT t.*, g.group FROM `teams` t ' +
    'INNER JOIN `groups` g ON g.id = t.group_id ' +
    'ORDER BY `team`';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteFlag = async (req, res) => {
  let dir = path.resolve(__dirname, '../..', 'static');
  const flag = dir + '/flags/' + req.query.oldFile;

  fs.unlink(flag, function (err) {
    if (err) {
      res.json(`Ошибка при удалении файла ${err}`);
    } else {
      res.json(`Файл ${req.query.oldFile} удалён`);
    }
  });
};

module.exports.updateFlag = async (req, res) => {
  const query = 'UPDATE `teams` SET `flag` = ? WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.body.fileName,
    req.body.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении флага в таблице teams'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
  //res.json({success: `Файл "${req.body.fileName}" добавлен`})
};

module.exports.addTeam = async (req, res) => {
  const query = 'INSERT INTO `teams` ' +
    '(`team`, `flag`, `group_id`, `order`)' +
    'VALUES (?, ?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.team,
    req.query.flag,
    req.query.group_id,
    req.query.order
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении новой команды в таблицу teams'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.updateTeam = async (req, res) => {
  const query = 'UPDATE `teams` ' +
    'SET `team` = ?, `flag` = ?, `group_id` = ?, `order` = ?, ' +
    '`place` = ' + `${!req.query.place ? 'NULL' : req.query.place} ` +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.team,
    req.query.flag,
    req.query.group_id,
    req.query.order,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении команды в таблице teams'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

/*module.exports.updatePlace = async (req, res) => {
  console.log('id:', req.query.id)
  console.log('place:', req.query.place)
  const query = 'UPDATE `teams` SET `place` = ? ' +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.place,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении места команды в таблице teams'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};*/

module.exports.deleteTeam = async (req, res) => {
  const query = 'DELETE FROM `teams` WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении команды из таблицы teams'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
