const STATUS_CODE = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
};

const MESSAGE_TYPE = {
  cast: 'Одно или несколько свойств не могут быть распознаны',
  validity: 'Не пройдена валидация данных',
  noUser: 'Пользователь с указанным id не найден',
  noCard: 'Карточка с указанным id не найдена',
  noPath: 'Неверно указан путь',
  unauthorized: 'Не пройдена авторизация',
  userExists: 'Пользователь уже существует',
  default: 'Внутренняя ошибка сервера',
};

const ERROR_TYPE = {
  cast: 'CastError',
  validity: 'ValidationError',
  authorization: 'AuthError',
};

module.exports = {
  STATUS_CODE, ERROR_TYPE, MESSAGE_TYPE,
};
