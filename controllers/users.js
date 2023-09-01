const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErr');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedErr = require('../errors/UnauthorizedErr');
const ConflictErr = require('../errors/ConflictErr');

const SALT_ROUNDS = 10;

module.exports.getAllUsers = (req, res, next) => User.find({})
  .then((users) => {
    if (users.length === 0) {
      throw new NotFoundError('Пользователи не найдены');
    }
    return res.send({ data: users });
  })
  .catch(next);

module.exports.getUser = (req, res, next) => User.findById(req.params.userId)
  .orFail()
  .then((user) => {
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Неправильный ID'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Пользователь не найден'));
    } else {
      next(err);
    }
  });

module.exports.createUser = (req, res, next) => {

  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.log(err)
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка данных'));
      } else if (err.code === 11000) {
        return next(new ConflictErr('Такая почта уже используется'))
      } else {
        next(err);
      }
    });
};

module.exports.patchUsers = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Неправильный ID' });
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Ошибка данных'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Ошибка данных'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthorizedErr("Email или password не могут быть пустыми");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {

      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: "7d" });

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      })
        .end();

    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new UnauthorizedErr('Почта или пароль введены не верно'))
      }
      next(err)
    })
};

module.exports.getMe = (req, res, next) => {

  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedErr('Необходима авторизация');
  };

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedErr('Необходима авторизация');
  }

  User.findById(payload._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователи не найдены');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Ошибка данных'));
      }
      next(err);
    });
}