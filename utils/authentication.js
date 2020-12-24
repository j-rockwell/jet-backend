const Token = require('../models/Token');

module.exports = {
  /**
   * Performs API Token check and returns the result in a callback
   * @param {*} token  API Key
   * @param {*} callback Result
   */
  authenticate: (token, callback) => {
    Token.findOne({ key: token }, (err, existing) => {
      if (err) {
        const result = {
          status: false,
          message: 'Failed to reach authentication server',
        };

        callback(result);
        return;
      }

      if (!existing) {
        const result = {
          status: false,
          message: 'Invalid API Key',
        };

        callback(result);
        return;
      }

      const result = {
        status: true,
        message: 'Success',
      };

      callback(result);
    });
  },
};
