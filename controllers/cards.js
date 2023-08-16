const Card = require('../models/card');

module.exports.getAllCards = (req, res) => Card.find({})
.then((cards) => {
  if (cards === null) {
    return res.status(404).send({ message: 'Карточки не найдены' });
  }
    return res.send({ data: cards });
  })
  .catch(() => {
    if (err.message === 'cardIsNotFound' ) {
      return res.status(404).send({ message: 'Карточки не найдены' });
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  });

module.exports.deleteCard = (req, res) => Card.findByIdAndDelete(req.params.cardId)
.then((card) => {
  if (card === null) {
    return res.status(404).send({ message: 'Карточки не найдены' });
  }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка данных' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });

module.exports.createCard = (req, res) => {
  const {
    name, link, owner = req.user._id, likes, createdAd,
  } = req.body;

  return Card.create({
    name, link, owner, likes, createdAd,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.putLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      return res.status(404).send({ message: 'Карточки не найдены' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка данных' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });

module.exports.deleteLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('cardIsNotFound'))
  .then((card) => {
    if (card === null) {
      return res.status(404).send({ message: 'Карточки не найдены' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка данных' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
