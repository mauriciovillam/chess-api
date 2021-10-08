const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gameService } = require('../services');

const createGame = catchAsync(async (req, res) => {
  const game = await gameService.createGame(req.body);
  res.status(httpStatus.CREATED).send(game);
});

const getGame = catchAsync(async (req, res) => {
  const game = await gameService.getGameById(req.params.gameId);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Game not found');
  }
  res.send(game);
});

const updateGame = catchAsync(async (req, res) => {
  const game = await gameService.updateLocalGameById(req.params.gameId, req.body);
  res.send(game);
});

const deleteGame = catchAsync(async (req, res) => {
  await gameService.deleteGameById(req.params.gameId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
};
