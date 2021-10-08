const { Chess } = require('chess.js');
const httpStatus = require('http-status');
const { Game } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a game
 * @param {Object} gameBody
 * @returns {Promise<Game>}
 */
const createGame = async (gameBody) => {
  return Game.create(gameBody);
};

/**
 * Get game by id
 * @param {ObjectId} id
 * @returns {Promise<Game>}
 */
const getGameById = async (id) => {
  return Game.findById(id);
};

/**
 * Update game by id
 * @param {ObjectId} gameId
 * @param {Object} updateBody
 * @returns {Promise<Game>}
 */
const updateMultiplayerGameById = async (gameId, updateBody) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }

  Object.assign(game, updateBody);
  await game.save();
  return game;
};

/**
 * Update (only local) game by id
 * @param {ObjectId} gameId
 * @param {Object} updateBody
 * @returns {Promise<Game>}
 */
const updateLocalGameById = async (gameId, updateBody) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }

  if (game.mode !== 'LOCAL') {
    throw new ApiError(httpStatus.BAD_REQUEST, "Multiplayer games can't be saved, to prevent data corruption.");
  }

  Object.assign(game, updateBody);
  await game.save();
  return game;
};

/**
 * Delete game by id
 * @param {ObjectId} gameId
 * @returns {Promise<Game>}
 */
const deleteGameById = async (gameId) => {
  const game = await getGameById(gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  await game.remove();
  return game;
};

module.exports = {
  createGame,
  getGameById,
  updateMultiplayerGameById,
  updateLocalGameById,
  deleteGameById,
};
