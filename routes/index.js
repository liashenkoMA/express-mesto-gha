const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');


router.use('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }).unknown(true),
}), userRouter);
router.use('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
    owner: Joi.object(),
    likes: Joi.object(),
    createAt: Joi.date(),
  }).unknown(true),
}), cardRouter);
router.patch('*', (req, res) => { res.status(404).send({ message: 'Страница не найдена' }); });

module.exports = router;
