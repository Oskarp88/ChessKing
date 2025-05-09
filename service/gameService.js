const gameRepository = require("../repositories/gameRepository");

class GameService{

  async getAvailableGames(){
    return await gameRepository.getAllAvailableGames();
  }

  async getRunningGames(gameId){
    return await gameRepository.getRunningGamesFindOne(gameId);
  }

  async getGames(gameId){
    return await gameRepository.getGamesFindOne(gameId);
  }

  async updateRunningGames(gameId, gameData){
    return await gameRepository.findOneAndUpdateGameRunning(gameId, gameData);
  }

  async updateGames(gameId, gameData){
    return await gameRepository.findOneAndUpdateGames(gameId, gameData);
  }

  async deleteAvailableGames(gameId){
    return await gameRepository.findOneAndDeleteAvailablesGames(gameId);
  }

  async deleteRunningGames(gameId){
    return await gameRepository.findOneAndDeleteRunningGames(gameId);
  }

  async deleteGames(gameId){
    return await gameRepository.findOneAndDeleteGames(gameId);
  }
}

module.exports = new GameService();