const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  deleteAccount
} = require('../controllers/authController');

const {
  authenticate,
  requireEmailVerification
} = require('../middleware/auth');

const {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validateNewPassword
} = require('../middleware/validation');

const {
  authLimiter,
  passwordResetLimiter
} = require('../middleware/security');

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);
router.post('/forgot-password', passwordResetLimiter, validatePasswordReset, forgotPassword);
router.put('/reset-password/:resettoken', authLimiter, validateNewPassword, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
