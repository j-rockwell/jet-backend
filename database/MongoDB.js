const mongoose = require('mongoose');

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
}

module.exports = connect;
