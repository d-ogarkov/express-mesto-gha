const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_TYPE, MESSAGE_TYPE, STATUS_CODE } = require('../constants/errors');

module.exports.getUsers = (req, res) => {
  User.find({}).select('name about avatar _id')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).select('name about avatar _id')
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });

  return true;
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};

module.exports.updateUser = (req, res) => {
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
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noUser });
      }
      res.send({ data: user });
      return true;
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};
