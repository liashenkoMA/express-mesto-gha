const router = require('express').Router();
const {
  getAllUsers, getUser, getMe, patchUsers, patchAvatar,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), patchUsers);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }).unknown(true),
}), patchAvatar);

module.exports = router;
