const Card = require('../models/card');

const ForbiddenRequest = require('../errors/ForbiddenRequest');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundErr');

module.exports.getAllCards = (req, res, next) => Card.find({})
  .orFail()
  .then((cards) => res.send({ data: cards }))
  .catch(next);

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenRequest('Нельзя удалить чужую карточку');
      }

      return Card.findByIdAndDelete(req.params.cardId)
        .then((result) => res.send({ data: result }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Ошибка данных'));
      } else {
        next(err);
      }
    });
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
        next(new BadRequest('Ошибка данных'));
      } else {
        next(err);
      }
    });
};

module.exports.putLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Такой карточки не существует'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Ошибка данных'));
    } else {
      next(err);
    }
  });

module.exports.deleteLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Такой карточки не существует'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Ошибка данных'));
    } else {
      next(err);
    }
  });
