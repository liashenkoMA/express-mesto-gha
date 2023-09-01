const router = require('express').Router();
const {
  getAllCards, deleteCard, createCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.get('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), getAllCards);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), createCard);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), putLikeCard);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), deleteLikeCard);

module.exports = router;
