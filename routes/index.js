
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundErr');


router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.patch('*', (req, res, next) => { next(new NotFoundError('Страница не найдена')) });

module.exports = router;
