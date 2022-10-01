const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth');
const { MESSAGE_TYPE } = require('../constants/errors');

// Middleware для авторизации
module.exports = (req, res, next) => {
  let token = req.cookies.jwt;

  // Кука 'jwt' с токеном должна присутствовать
  if (!token) {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthError(MESSAGE_TYPE.unauthorized);
    }
    token = authorization.replace('Bearer ', '');
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
