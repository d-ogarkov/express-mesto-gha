const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { MESSAGE_TYPE, STATUS_CODE } = require('./constants/errors');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

// Для разбора JSON
app.use(bodyParser.json());

// Для обработки кук, т.к. токен отдаем в куки
app.use(cookieParser());

// Эти роуты не требуют авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// Авторизация
app.use(auth);

// Все роуты ниже требуют авторизации
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// После всех роутов ловим неправильные пути
app.use((req, res) => res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noPath }));

// И централизованно обрабатываем ошибки
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
