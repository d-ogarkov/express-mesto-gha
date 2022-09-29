const { STATUS_CODE } = require('../constants/errors');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.unauthorized;
  }
}

module.exports = AuthError;
