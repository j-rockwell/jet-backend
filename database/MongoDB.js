const mongoose = require('mongoose');
const Token = require('../models/Token');

require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
let db;

mongoose.Promise = global.Promise;

/**
 * Process MongoDB errors
 * @param {*} err Error
 */
function onError(err) {
  console.log(`MongoDB encountered an error: ${err}`);
}

/**
 * Process a new MongoDB connection
 */
function onConnected() {
  console.log('Connected to a MongoDB database instance');
}

/**
 * Process a MongoDB reconnection
 */
function onReconnected() {
  console.log('Reconnection to MongoDB database instance was successful');
}

/**
 * Process a force termination of the application
 */
function onSigint() {
  db.close(() => {
    console.log(
      'MongoDB database connection was interrupted through app termination',
    );
    process.exit();
  });
}

/**
 * Connect to a MongoDB database instance
 */
function connect() {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;

  db.on('error', onError);
  db.on('connected', onConnected);
  db.on('reconnected', onReconnected);
  process.on('SIGINT', onSigint);

  // Generate a Test API Key to use for development
  // automatically and remove it when we move over to production
  if (process.env.NODE_ENV === 'development') {
    Token.findOne({ name: 'Test' }, (err, existing) => {
      if (err) {
        throw err;
      }

      if (existing) {
        return;
      }

      const testToken = new Token({
        name: 'Test',
        key: '123',
        dateCreated: new Date(),
      });

      testToken.save().then(() => {
        console.log('Generated a test API Key, see docs for more info');
      });
    });
  } else if (process.env.NODE_ENV === 'production') {
    Token.findOne({ name: 'Test' }, (err, existing) => {
      if (err) {
        throw err;
      }

      if (existing) {
        existing.delete().then(() => {
          console.log('Removed a test API Key, see docs for more info');
        });
      }
    });
  }
}

module.exports = connect;
