const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth');
const { MESSAGE_TYPE } = require('../constants/errors');

// Middleware для авторизации
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  // Кука 'jwt' с токеном должна присутствовать
  if (!token) {
    throw new AuthError(MESSAGE_TYPE.unauthorized);
  }

  let payload;

  // Верифицируем переданный токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthError(MESSAGE_TYPE.unauthorized);
  }

  // Добавляем payload в запрос и передаем следующему обработчику
  req.user = payload;
  next();
};
