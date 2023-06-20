const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moves: [{ type: String }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result: { type: String, enum: ['pending', 'draw', 'win'] },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;