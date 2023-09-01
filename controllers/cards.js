const Card = require('../models/card');

const ForbiddenRequest = require('../errors/ForbiddenRequest');
const CastError = require('../errors/CastError');
const NotFoundError = require('../errors/NotFoundErr');
const ValidationError = require('../errors/ValidationError');


module.exports.getAllCards = (req, res, next) => Card.find({})
  .then((cards) => {
    if (cards.length === 0) {
      throw new NotFoundError('Карточки не найдены')
    }
    return res.send({ data: cards });
  })
  .catch(next);

module.exports.deleteCard = (req, res, next) => {

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenRequest('Нельзя удалить чужую карточку')
      }

      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          return res.send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Ошибка данных'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Такой карточки не существует'))
      } else {
        next(err)
      }
    })
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link, owner = req.user._id, likes, createdAd,
  } = req.body;

  return Card.create({
    name, link, owner, likes, createdAd,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Ошибка данных'));
      }
      next(err);
    });
};

module.exports.putLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => {
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Ошибка данных'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Карточки не найдены'));
    } else {
      next(err);
    }
  });

module.exports.deleteLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Карточки не найдены');
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Ошибка данных'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Карточки не найдены'));
    } else {
      next(err);
    }
  });
