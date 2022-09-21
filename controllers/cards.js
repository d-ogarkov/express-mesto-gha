const Card = require('../models/card');
const { ERROR_TYPE, MESSAGE_TYPE, STATUS_CODE } = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({}).select('name link owner likes _id')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        return res.status(STATUS_CODE.badRequest).send({ message: MESSAGE_TYPE.validity });
      }
      return res.status(STATUS_CODE.internalServerError).send({ message: MESSAGE_TYPE.default });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noCard });
      }
      res.send({ data: card });
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).select('name link owner likes _id')
    .then((card) => {
      if (!card) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noCard });
      }
      res.send({ data: card });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).select('name link owner likes _id')
    .then((card) => {
      if (!card) {
        return res.status(STATUS_CODE.notFound).send({ message: MESSAGE_TYPE.noCard });
      }
      res.send({ data: card });
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
