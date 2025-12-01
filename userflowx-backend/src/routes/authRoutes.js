const express = require('express');
const authController = require('../controllers/authController');
const { registerSchema, loginSchema, resetPasswordSchema, validateRequest } = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;
