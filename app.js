const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const MongoDB = require('./database/MongoDB');

const app = express();

/**
 * Helmet improves Express security by setting various HTTP headers
 */
app.use(helmet());

/**
 * Get NODE_ENV from environment and store in Express
 */
app.set('env', process.env.NODE_ENV);

/**
 * Standard Express configuration
 */
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes
 */
app.use('/users', require('./routes/users'));
app.use('/sessions', require('./routes/sessions'));

/**
 * Initialize MongoDB instance
 */
MongoDB();

module.exports = app;
