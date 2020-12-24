const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

require('dotenv').config();

const { SALT_ROUNDS, SECRET_JWT } = process.env;

// TODO: Move each method outside module.exports and call them all at the bottom

module.exports = {
  /**
   * Creates a new User document from a request body
   * @param {*} req Request
   * @param {*} res Response
   */
  create: (req, res) => {
    const { email } = req.body;
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { password } = req.body;

    if (firstName.length < 2 || firstName.length > 32) {
      res.status(401).send({
        message: 'First name must be 2-32 characters long',
      });

      return;
    }

    if (!firstName.match('^[a-zA-Z0-9_]*$')) {
      res.status(401).send({
        message: 'First name must be characters A-Z, a-z',
      });

      return;
    }

    if (lastName.length < 2 || lastName.length > 32) {
      res.status(401).send({
        message: 'Last name must be 2-32 characters long',
      });

      return;
    }

    if (!lastName.match('^[a-zA-Z0-9_]*$')) {
      res.status(401).send({
        message: 'Last name must be characters A-Z, a-z',
      });

      return;
    }

    if (password.length < 8 || password.length > 32) {
      res.status(401).send({
        message: 'Password must be 8-32 characters long',
      });
    }

    User.findOne({ email }, (err, existing) => {
      if (err) {
        res.status(401).send({
          message: 'Failed to retreive database information',
        });

        throw err;
      }

      if (existing) {
        console.log(`found user with email: ${existing.email}`);

        res.status(401).send({
          message: 'Email is already in use',
        });

        return;
      }

      bcrypt.hash(password, parseInt(SALT_ROUNDS, 10), (hashErr, hash) => {
        if (hashErr) {
          res.status(401).send({
            message: 'Failed to hash password',
          });

          throw hashErr;
        }

        const user = new User({
          firstName,
          lastName,
          email,
          emailConfirmed: false,
          password: hash,
        });

        user.save().then(() => {
          const token = jwt.sign({ id: user.id }, SECRET_JWT, {
            expiresIn: 86400,
          });

          res.status(201).send({
            message: 'Account has been created',
            token,
          });

          console.log(`Successfully created new user for ${email}`);
        });
      });
    });
  },

  /**
   * Processes a login from a POST request
   * @param {*} req Request
   * @param {*} res Response
   */
  login: (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err) {
        res.status(401).send('An error occured');
        return;
      }

      if (!user) {
        res.status(401).send('Account not found');
        return;
      }

      if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).send('Invalid password');
        return;
      }

      const token = jwt.sign({ id: user.id }, SECRET_JWT, { expiresIn: 86400 });
      res.status(200).send({ message: 'Success', token });
    });
  },

  /**
   * Handles updating account information for a user
   *
   * !!! NOTE: This does not handle updating passwords, we use #updatePassword for that. !!!
   * @param {*} req
   * @param {*} res
   */
  updateInfo: (req, res) => {
    const { email, firstName, lastName } = req.body;

    User.findById(req.userId, (err, user) => {
      const existingUser = user;

      if (err) {
        res.status(401).send('An error occured');
        return;
      }

      if (!user) {
        res.status(404).send('Account not found');
        return;
      }

      User.findOne({ email }, (overlapErr, overlappingUser) => {
        if (overlapErr) {
          res.status(401).send('An error occured');
          return;
        }

        if (overlappingUser && user.email !== email) {
          res.status(401).send('Email is already in use');
          return;
        }

        if (user.email !== email && user.emailConfirmed) {
          existingUser.emailConfirmed = false;
        }

        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.email = email;

        existingUser.save().then(() => res.status(200).send(existingUser));
      });
    });
  },

  /**
   * Processes a POST request to update an account password
   * @param {*} req Request
   * @param {*} res Response
   */
  updatePassword: (req, res) => {
    const { password } = req.body;

    User.findById(req.userId, (err, user) => {
      const foundUser = user;

      if (err) {
        res.status(401).send('An error occured');
        return;
      }

      if (!user) {
        res.status(404).send('Account not found');
        return;
      }

      bcrypt.hashSync(password, parseInt(SALT_ROUNDS, 10), (hashErr, hash) => {
        if (hashErr) {
          res.status(401).send('An error occured');
          throw err;
        }

        foundUser.password = hash;

        foundUser.save().then(() => {
          res.status(200).send('Password updated successfully');
        });
      });
    });
  },
};
