const { STATUS_CODE } = require('../constants/errors');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.internalServerError;
  }
}

module.exports = InternalServerError;
