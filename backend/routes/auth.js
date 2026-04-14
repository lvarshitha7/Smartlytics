// routes/auth.js
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], ctrl.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], ctrl.login);

router.get('/me', auth, ctrl.getMe);
router.put('/profile', auth, ctrl.updateProfile);

module.exports = router;
