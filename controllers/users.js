const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found');
const ValidityError = require('../errors/validity');
const AuthError = require('../errors/auth');
const ConflictError = require('../errors/conflict');
const { ERROR_TYPE, MESSAGE_TYPE } = require('../constants/errors');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({
        name: user.name,
        about: user.about,
        avatar: user.about,
        email: user.email,
      });

      // Вернем токен в куке с опциями httpOnly и sameSite
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).end();
    })
    .catch((err) => {
      console.log(err);
      throw new AuthError(MESSAGE_TYPE.unauthorized);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({}).select('name about avatar email _id')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId).select('name about avatar email _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);

  return true;
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).select('name about avatar email _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);

  return true;
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(MESSAGE_TYPE.userExists);
      } else
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // Вернуть обновленную запись из базы, а не старую
      runValidators: true, // Данные будут валидированы перед изменением
    },
  ).select('name about avatar _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // Вернуть обновленную запись из базы, а не старую
      runValidators: true, // Данные будут валидированы перед изменением
    },
  ).select('name about avatar _id')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MESSAGE_TYPE.noUser);
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        throw new ValidityError(MESSAGE_TYPE.validity);
      } else {
        throw err;
      }
    })
    .catch(next);
};
