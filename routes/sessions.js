const router = require('express').Router();

const SessionController = require('../controllers/SessionController');
const Verify = require('../utils/Verify');

/**
 * Handles POST request to create a new session in the database
 */
router.post('/create', Verify, (req, res) => {
  SessionController.createSession(req, res);
});

/**
 * Handles GET request to obtain information about an existing session from the database
 */
router.get('/', Verify, (req, res) => {
  SessionController.getSession(req, res, (callback) => {
    res.status(200).send(callback);
  });
});

module.exports = router;
