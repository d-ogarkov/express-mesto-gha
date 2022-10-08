const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const ValidityError = require('../errors/validity');
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

      // Вернем токен в куке с опциями httpOnly и sameSite
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });

      res.send({ token }).end();
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
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
      if (err.name === ERROR_TYPE.cast) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });

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
        return next(new ConflictError(MESSAGE_TYPE.userExists));
      }
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
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
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
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
      if (err.name === ERROR_TYPE.validity) {
        return next(new ValidityError(MESSAGE_TYPE.validity));
      }
      return next(err);
    });
};
