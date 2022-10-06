const { Joi } = require('celebrate');

const TYPE = {
  mongooseObjectId: Joi.string().hex().length(24),
};

module.exports = {
  TYPE,
};
