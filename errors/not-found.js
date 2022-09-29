const { STATUS_CODE } = require('../constants/errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.notFound;
  }
}

module.exports = NotFoundError;
