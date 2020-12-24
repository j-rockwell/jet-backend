const auth = require('../utils/authentication');

const Session = require('../models/Session');

module.exports = {
  createSession: (req, res) => {
    const data = req.body;
    const { token } = req.body;
    const session = new Session(data);

    auth.authenticate(token, (result) => {
      if (result.status === false) {
        res.status(401).send({
          message: result.message,
        });

        return;
      }

      session.save().then(() => {
        res.status(200).send({
          message: 'Session has been saved successfully',
        });

        console.log(
          `Created new session "${
            session.id
          }" containing ${
            session.exercises.length
          } exercises`,
        );
      });
    });
  },

  getSession: (req, res) => {
    const { id } = req.body;
    const { token } = req.body;

    auth.authenticate(token, (result) => {
      if (result.status === false) {
        res.status(401).send({
          message: result.message,
        });

        return;
      }

      Session.findById(id, (err, session) => {
        if (err) {
          res.status(401).send({
            message: 'Failed to establish connection to session server',
          });

          throw err;
        }

        if (!session) {
          res.status(404).send({
            message: 'Session not found',
          });

          return;
        }

        res.status(200).send(JSON.stringify(session));
      });
    });
  },

  deleteSession: (req, res) => {
    const { id } = req.body;
    const { token } = req.body;

    auth.authenticate(token, (result) => {
      if (result.status === false) {
        res.status(401).send({
          message: result.message,
        });

        return;
      }

      Session.findById(id, (err, session) => {
        if (err) {
          res.status(401).send({
            message: 'Failed to establish connection to session server',
          });

          throw err;
        }

        if (!session) {
          res.status(404).send({
            message: 'Session not found',
          });

          return;
        }

        session.delete().then(() => {
          res.status(200).send({
            message: 'Session has been deleted successfully',
          });
        });
      });
    });
  },
};
