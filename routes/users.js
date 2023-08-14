const router = require('express').Router();
const {
  getAllUsers, getUser, createUser, patchUsers, patchAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', patchUsers);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
