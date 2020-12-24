const Session = require('../models/Session');

/**
 * Handles a POST request to create a new session
 * @param {*} req Request
 * @param {*} res Response
 */
function createSession(req, res) {
  const data = req.body;
  const session = new Session(data);

  session.save().then(() => {
    res.status(200).send('Success');
  });
}

/**
 * Handles a GET request to obtain an existing session's data
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} callback Callback
 */
function getSession(req, res, callback) {
  const { id } = req.body;

  Session.findById(id, (err, session) => {
    if (err) {
      res.status(401).send('An error occured');
      return;
    }

    if (!session) {
      res.status(404).send('Session not found');
      return;
    }

    callback(session);
  });
}

module.exports.createSession = createSession;
module.exports.getSession = getSession;
