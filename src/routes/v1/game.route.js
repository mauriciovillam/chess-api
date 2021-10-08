const express = require('express');
const validate = require('../../middlewares/validate');
const gameValidation = require('../../validations/game.validation');
const gameController = require('../../controllers/game.controller');

const router = express.Router();

router.route('/').post(validate(gameValidation.createGame), gameController.createGame);

router
  .route('/:gameId')
  .get(validate(gameValidation.getGame), gameController.getGame)
  .post(validate(gameValidation.updateGame), gameController.updateGame)
  .delete(validate(gameValidation.deleteGame), gameController.deleteGame);

module.exports = router;
