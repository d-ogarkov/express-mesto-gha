const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: { // Валидация корректности ссылки на картинку на уровне схемы
      validator(v) {
        return /(https?:\/\/)?(www.)?[a-z0-9-.]+\.[a-z0-9-]+[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?/i.test(v);
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Не возвращать хэш пароля в селекте
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  // Поскольку в модели для password указано 'select: false', по умолчанию оно
  // не возвращается, и здесь нужно в явном виде запросить селект этого поля
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // Теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
