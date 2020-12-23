const router = require('express').Router();

const UserController = require('../controllers/UserController');

/**
 * Handles POST request to create a new account
 */
router.post('/create', (req, res, next) => {
    UserController.create(req, res);
});

/**
 * Handles POST request to sign in to an existing account
 */
router.post('/login', (req, res, next) => {
    UserController.login(req, res);
});

/**
 * Handles POST request to update basic account information
 * 
 * Does not handle password updates
 */
router.post('/update/info', (req, res, next) => {
    UserController.updateInfo(req, res);
});

/**
 * Handles POST request to update password for an account
 */
router.post('/update/password', (req, res, next) => {
    UserController.updatePassword(req, res);
});

module.exports = router;