const { Chess } = require('chess.js');
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const pgnValidation = (value, helpers) => {
  if (!new Chess().load_pgn(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};

const createGame = {
  body: Joi.object().keys({
    mode: Joi.string().required().valid('MULTIPLAYER', 'LOCAL'),
  }),
};

const getGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

const updateGame = {
  params: Joi.object().keys({
    gameId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      pgn: Joi.string().required().custom(pgnValidation),
      name: Joi.string().optional(),
    })
    .min(1),
};

const deleteGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
};
