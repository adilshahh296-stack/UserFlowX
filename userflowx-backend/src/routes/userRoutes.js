const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// User routes
router.get('/profile', userController.getProfile);

// Admin routes
router.get('/all', roleMiddleware(['admin']), userController.getAllUsers);
router.put('/:userId/role', roleMiddleware(['admin']), userController.updateUserRole);
router.delete('/:userId', roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
