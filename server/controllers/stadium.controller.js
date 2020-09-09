const pool = require('../middleware/database');
const path = require('path');
const fs = require('fs');

module.exports.loadStadiums = async (req, res) => {
  const query = 'SELECT * FROM `stadiums` ORDER BY `city`';

  await pool.promise().execute(query)
  .then(([rows, fields]) => {
    res.json(rows)
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteImage = async (req, res) => {
  let dir = path.resolve(__dirname, '../..', 'static');
  const stadium = dir + '/stadiums/' + req.query.oldFile;

  fs.unlink(stadium, function (err) {
    if (err) {
      res.json(`Ошибка при удалении файла ${err}`);
    } else {
      res.json(`Файл ${req.query.oldFile} удалён`);
    }
  });
};

module.exports.updateImage = async (req, res) => {
  const query = 'UPDATE `stadiums` SET `image` = ? WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.body.fileName,
    req.body.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении картинки в таблице stadiums'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.addStadium = async (req, res) => {
  const query = 'INSERT INTO `stadiums` ' +
    '(`city`, `stadium`, `image`)' +
    'VALUES (?, ?, ?)';

  await pool.promise().execute(query, [
    req.query.city,
    req.query.stadium,
    req.query.image
  ])
  .then((result) => {
    if (result) {
      res.json({id: result[0].insertId})
    } else {
      res.json({error: 'Ошибка при добавлении нового стадиона в таблицу stadiums'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.updateStadium = async (req, res) => {
  const query = 'UPDATE `stadiums` ' +
    'SET `city` = ?, `stadium` = ?, `image` = ? ' +
    'WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.city,
    req.query.stadium,
    req.query.image,
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при обновлении стадиона в таблице stadiums'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
};

module.exports.deleteStadium = async (req, res) => {
  const query = 'DELETE FROM `stadiums` WHERE `id` = ?';

  await pool.promise().execute(query, [
    req.query.id
  ])
  .then((result) => {
    if (result) {
      res.json(true)
    } else {
      res.json({error: 'Ошибка при удалении стадиона из таблицы stadiums'})
    }
  })
  .catch((e) => {
    res.json({error: e.message})
  })
}
