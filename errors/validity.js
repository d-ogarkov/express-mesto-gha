const { STATUS_CODE } = require('../constants/errors');

class ValidityError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE.badRequest;
  }
}

module.exports = ValidityError;
