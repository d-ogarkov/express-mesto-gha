const { STATUS_CODE } = require('../constants/errors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.forbidden;
  }
}

module.exports = ForbiddenError;
