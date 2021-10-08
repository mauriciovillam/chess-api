const { Chess } = require('chess.js');
const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const gameSchema = mongoose.Schema(
  {
    pgn: {
      type: String,
      required: false,
      validate(value) {
        if (value && !new Chess().load_pgn(value) && value !== 'start') {
          throw new Error('The game PGN code is invalid.');
        }
      },
      default: '',
    },
    mode: {
      type: String,
      enum: ['MULTIPLAYER', 'LOCAL'],
    },
    name: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gameSchema.plugin(toJSON);

gameSchema.virtual('chessBoard').get(function () {
  const chess = new Chess();
  if (this.pgn) {
    chess.load_pgn(this.pgn);
  }
  return chess;
});

/**
 * @typedef Game
 */
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
