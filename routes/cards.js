const router = require('express').Router();
const {
  getAllCards, deleteCard, createCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.get('/', getAllCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), putLikeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), deleteLikeCard);

module.exports = router;
