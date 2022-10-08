const Card = require('../models/card');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');
const { MESSAGE_TYPE } = require('../constants/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({}).select('name link owner likes _id')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_TYPE.noCard);
      }

      // Проверим, принадлежит ли эта карточка текущему пользователю
      const isOwn = card.owner._id.equals(req.user._id);
      if (!isOwn) {
        throw new ForbiddenError(MESSAGE_TYPE.forbidden);
      }

      // Если проверка пройдена, удалим карточку
      Card.findByIdAndRemove(req.params.cardId)
        .then((deletedCard) => res.send({ data: deletedCard }))
        .catch(next);
      return true;
    })
    .catch(next);

  return true;
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).select('name link owner likes _id')
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_TYPE.noCard);
      }
      res.send({ data: card });
      return true;
    })
    .catch(next);

  return true;
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).select('name link owner likes _id')
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MESSAGE_TYPE.noCard);
      }
      res.send({ data: card });
      return true;
    })
    .catch(next);

  return true;
};
