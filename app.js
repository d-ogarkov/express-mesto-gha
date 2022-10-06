const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { MESSAGE_TYPE, STATUS_CODE } = require('./constants/errors');
const { REGEX_PATTERN } = require('./constants/patterns');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true, // Без этого не будет работать unique: true в userSchema.email
});

// Для разбора JSON
app.use(bodyParser.json());

// Для обработки кук, т.к. токен отдаем в куки
app.use(cookieParser());

// Эти роуты не требуют авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_PATTERN.url),
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), createUser);

// Авторизация
app.use(auth);

// Все роуты ниже требуют авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// После всех роутов ловим неправильные пути
//app.use((req, res) => res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noPath }));

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  // Если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // Проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? MESSAGE_TYPE.default
        : message,
    });

  next();
});

// Слушаем порт
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
