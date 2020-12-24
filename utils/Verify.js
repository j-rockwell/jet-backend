const jwt = require('jsonwebtoken');

require('dotenv').config();

const { SECRET_JWT } = process.env;

function run(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    res.status(403).send('No token provided');
    return;
  }

  jwt.verify(token, SECRET_JWT, (err, decoded) => {
    if (err) {
      res.status(500).send('Failed to authenticate');
      return;
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = run;
