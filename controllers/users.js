const User = require('../models/user');

module.exports.getAllUsers = (req, res) => User.find({})
  .orFail(new Error('UserNotFound'))
  .then((users) => {
    return res.send({ data: users });
  })
  .catch(() => {
    if (err.message === 'UserNotFound') {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  });

module.exports.getUser = (req, res) => User.findById(req.params.userId)
  .orFail(new Error('UserNotFound'))
  .then((user) => {
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Неправильный ID' });
    } else if (err.message === 'UserNotFound') {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.patchUsers = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('UserNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный ID' });
      } if (err.message === 'UserNotFound') {
        return res.status(404).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('UserNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный ID' });
      } if (err.message === 'UserNotFound') {
        return res.status(404).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
