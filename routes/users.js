const router = require('express').Router();

const UserController = require('../controllers/UserController');
const Verify = require('../utils/Verify');

/**
 * Handles GET request to retrieve a users account data
 */
router.get('/', Verify, (req, res) => {
  UserController.get(req, res);
});

/**
 * Handles POST request to create a new account
 */
router.post('/create', (req, res) => {
  UserController.create(req, res);
});

/**
 * Handles POST request to sign in to an existing account
 */
router.post('/login', (req, res) => {
  UserController.login(req, res);
});

/**
 * Handles POST request to update basic account information
 *
 * Does not handle password updates
 */
router.post('/update/info', Verify, (req, res) => {
  UserController.updateInfo(req, res);
});

/**
 * Handles POST request to update password for an account
 */
router.post('/update/password', Verify, (req, res) => {
  UserController.updatePassword(req, res);
});

module.exports = router;
