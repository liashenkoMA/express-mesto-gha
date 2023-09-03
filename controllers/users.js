const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErr');
const BadRequest = require('../errors/BadRequest');
const ConflictErr = require('../errors/ConflictErr');

const SALT_ROUNDS = 10;

module.exports.getAllUsers = (req, res, next) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

module.exports.getUser = (req, res, next) => User.findById(req.params.userId)
  .orFail(new NotFoundError('Пользователь не найден'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequest('Неправильный ID'));
    } else {
      next(err);
    }
  });

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Ошибка данных'));
      } else if (err.code === 11000) {
        next(new ConflictErr('Такая почта уже используется'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUsers = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email,
      });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = jwt.verify(token, 'some-secret-key');

  User.findById(payload._id)
    .orFail(new NotFoundError('Пользователи не найдены'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
