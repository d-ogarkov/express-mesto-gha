const { STATUS_CODE } = require('../constants/errors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.conflict;
  }
}

module.exports = ConflictError;
