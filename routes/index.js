
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');


router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.patch('*', (req, res) => { res.status(404).send({ message: 'Страница не найдена' }); });

module.exports = router;
