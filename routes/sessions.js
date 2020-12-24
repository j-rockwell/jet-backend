const router = require('express').Router();

const SessionController = require('../controllers/SessionController');

/**
 * Handles POST request to create a new session in the database
 */
router.post('/create', (req, res) => {
  SessionController.createSession(req, res);
});

module.exports = router;
