const router = require('express').Router();
const {
  getAllUsers, getUser, getMe, patchUsers, patchAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
router.patch('/me', patchUsers);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
