const express = require('express');
const gameRouter = express.Router();
const { verifyToken } = require('../config/jwt.js');
const Game = require('../model/Game.js');
const User = require('../model/User.js');

// Crear una nueva partida
gameRouter.post('/games', (req, res) => {
  const token = req.headers.authorization;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  const { player1, player2 } = req.body;

  const game = new Game({ player1, player2 });

  game
    .save()
    .then(savedGame => {
        // Actualizar la puntuación de los jugadores
      User.findByIdAndUpdate(player1, { $inc: { score: 3 } }).exec();
      User.findByIdAndUpdate(player2, { $inc: { score: 3 } }).exec();
      res.json(savedGame);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al crear la partida' });
    });
});

// Obtener todas las partidas
gameRouter.get('/games', (req, res) => {
  Game.find()
    .then(games => {
      res.json(games);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al obtener las partidas' });
    });
});

// Finalizar una partida
gameRouter.put('/games/:id', (req, res) => {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);
  
    if (!decoded) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    const { id } = req.params;
    const { winner, loser, tied } = req.body;
  
    const update = {};
  
    if (winner) {
      update.winner = winner;
      update.loser = loser;
      User.findByIdAndUpdate(winner, { $inc: { gamesWon: 1, score: 3 } }).exec();
      User.findByIdAndUpdate(loser, { $inc: { gamesLost: 1, score: -2 } }).exec();
    } else if (tied) {
      update.tied = tied;
      User.findByIdAndUpdate(tied[0], { $inc: { gamesTied: 1, score: 1 } }).exec();
      User.findByIdAndUpdate(tied[1], { $inc: { gamesTied: 1, score: 1 } }).exec();
    }
  
    Game.findByIdAndUpdate(id, update, { new: true })
      .then(updatedGame => {
        if (!updatedGame) {
          return res.status(404).json({ message: 'Partida no encontrada' });
        }

        // Actualizar la puntuación de los jugadores
      if (winner) {
        User.findByIdAndUpdate(winner, { $inc: { gamesWon: 1, score: 3 } }).exec();
        User.findByIdAndUpdate(loser, { $inc: { gamesLost: 1, score: -2 } }).exec();
      } else if (tied) {
        User.findByIdAndUpdate(tied[0], { $inc: { gamesTied: 1, score: 1 } }).exec();
        User.findByIdAndUpdate(tied[1], { $inc: { gamesTied: 1, score: 1 } }).exec();
      }

      // Actualizar el ranking
      User.find({}, '-password')
        .sort({ score: -1 })
        .then(users => {
          // Aquí puedes hacer cualquier acción necesaria con el ranking
        })
        .catch(error => {
          console.error('Error al obtener el ranking:', error);
        });

        res.json(updatedGame);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al finalizar la partida' });
      });
  });

  // Crear una partida online y emparejar jugadores al azar
gameRouter.post('/games', (req, res) => {
    const { player1, player2 } = req.body;
  
    const game = new Game({
      player1,
      player2,
      status: 'pending'
    });
  
    game.save()
      .then(savedGame => {
        res.json(savedGame);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al crear la partida' });
      });
  });
  
  

module.exports = gameRouter;
