const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema({
  blackPlayer: String,
  whitePlayer: String,
  game: Array,
  move: Array,
  gameState: String,
  timeType: String,
  photoUrl: String,
  playerColor: String,
  chetingWhite: {
    totalMoves: Number,
    perfectMoves: Number,
    ratio: String,
    status: String
  },
  chetingBlack: {
    totalMoves: Number,
    perfectMoves: Number,
    ratio: String,
    status: String
  },

}, { timestamps: true });


const userSchema = new mongoose.Schema({
  uid: String,
  name: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  isAdmin: String,
  password: String,
  photo: String,
  flags: String,
  frame: String,
  isAdmin: String,
  deleted: { type: Boolean, default: false },
  totalGames: { type: Number, default: 0 },
  totalWonGames: { type: Number, default: 0 },
  totalLostGames: { type: Number, default: 0 },
  totalTiedGames: { type: Number, default: 0 },
  totalGamesBullet: { type: Number, default: 0 },
  totalWonGamesBullet: { type: Number, default: 0 },
  totalLostGamesBullet: { type: Number, default: 0 },
  totalTiedGamesBullet: { type: Number, default: 0 },
  totalGamesClassical: { type: Number, default: 0 },
  totalWonGamesClassical: { type: Number, default: 0 },
  totalLostGamesClassical: { type: Number, default: 0 },
  totalTiedGamesClassical: { type: Number, default: 0 },
  totalGamesBlitz: { type: Number, default: 0 },
  totalWonGamesBlitz: { type: Number, default: 0 },
  totalLostGamesBlitz: { type: Number, default: 0 },
  totalTiedGamesBlitz: { type: Number, default: 0 },
  totalGamesRapid: { type: Number, default: 0 },
  totalWonGamesRapid: { type: Number, default: 0 },
  totalLostGamesRapid: { type: Number, default: 0 },
  totalTiedGamesRapid: { type: Number, default: 0 },
  totalWinningStreaks: { type: Number, default: 0 },
  winningStreaks: { type: Number, default: 0 },
  eloBullet: { type: Number, default: 0 },
  eloBlitz: { type: Number, default: 0 },
  eloRapid: { type: Number, default: 0 },
  eloClassical: { type: Number, default: 0 },
  country: String,
  resetToken: String,
  resetTokenExpiration: Date,
  rango: String,
  insignia: String,
  partida: [partidaSchema] // Usa el esquema de partidas definido arriba
});

const User = mongoose.model('User', userSchema);

module.exports = User;
