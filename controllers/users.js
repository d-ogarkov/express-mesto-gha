const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_TYPE, MESSAGE_TYPE, STATUS_CODE } = require('../constants/errors');

module.exports.getUsers = (req, res) => {
  User.find({}).select('name about avatar _id')
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === ERROR_TYPE.validity) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.cast });
      } else {
        return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
      }
    });
}

module.exports.getUser = (req, res) => {
  // Сначала проверим переданный userId на валидность. Если он невалидный, не будем ничего искать
  const _id = req.params.userId;
  const isValidId = mongoose.Types.ObjectId.isValid(_id);
  if (!isValidId) {
    return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.cast });
  }

  User.findById(req.params.userId).select('name about avatar _id')
    .then(user => {
      if (!user) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      }
      else {
        res.send({ data: user });
      }
    })
    .catch(err => {
      if (err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      } else {
        return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === ERROR_TYPE.validity) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.cast });
      } else {
        return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
      }
    });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  console.log(name);
  console.log(about);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // Вернуть обновленную запись из базы, а не старую
      runValidators: true // Данные будут валидированы перед изменением
    }
  ).select('name about avatar _id')
    .then(user => { console.log(user); res.send({ data: user }) })
    .catch(err => {
      if (err.name === ERROR_TYPE.validity) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      } else if (err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      } else {
        return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
      }
    });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // Вернуть обновленную запись из базы, а не старую
      runValidators: true // Данные будут валидированы перед изменением
    }).select('name about avatar _id')
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === ERROR_TYPE.validity) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      } else if (err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      } else {
        return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
      }
    });
}
