const User = require('../models/user');

module.exports.getAllUsers = (req, res) => User.find({})
  .then((users) => {
    if (users === null) {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }
    return res.send({ data: users });
  })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

  module.exports.getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (user === null) {
      return res.status(404).send({ message: 'Пользователи не найдены' });
    }

    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Неправильный ID' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.log(err)
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.patchUsers = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if ( user === null) {
        return res.status(404).send({ message: 'Неправильный ID' });
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .then((user) => {
    if (user === null) {
      return res.status(404).send({ message: 'Неправильный ID' });
    }
    res.send({ data: user })
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный ID' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
