const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63242dc2bcbb9dc5803985ae'
  };
  next();
});

app.use(bodyParser.json());

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// Слушаем порт
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
