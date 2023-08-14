const router = require('express').Router();
const {
  getAllCards, deleteCard, createCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
