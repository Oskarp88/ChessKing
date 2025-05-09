const AvailableGames = require("../model/AvailableGames");
const Games = require("../model/Games");
const RunningGames = require("../model/RunningGames");

class GameRepository {

  async getAllAvailableGames(){
    return await AvailableGames.find({});
  }

  async getRunningGamesFindOne(gameId){
    return await RunningGames.findOne({gameId});
  }

  async getGamesFindOne(gameId){
    return await Games.findOne({gameId});
  }

  async findOneAndUpdateGameRunning(gameId, gameData){
    return await RunningGames.findOneAndUpdate(
       {gameId},
       gameData,
       { new: true}
    );
  }

  async findOneAndUpdateGames(gameId, gameData){
    return await Games.findOneAndUpdate(
      {gameId},
      gameData,
      {new: true}
    )
  }

  async findOneAndDeleteAvailablesGames(gameId){
    return AvailableGames.findOneAndDelete({ gameId })
  }

  async findOneAndDeleteRunningGames(gameId){
    return RunningGames.findOneAndDelete({gameId});
  }
  
  async findOneAndDeleteGames(gameId){
    return Games.findOneAndDelete({gameId});
  }
}

module.exports = new GameRepository();