const userRepository = require("../repositories/userRepository");

class UserService {
    async getUsers() {
      return await userRepository.getAllUsers();
    }
  
    async getUser(id) {
      return await userRepository.getUserById(id);
    }

    async getUserAndSelectGames(id) {
      return await userRepository.getUserByIdAndSelectGames(id);
    }
    
    async getUserFind(data) {
      return await userRepository.getUserOne(data);
    }
  
    async createUser(data) {
      return await userRepository.createUser(data);
    }
  
    async updateUser(id, data) {
      return await userRepository.updateUser(id, data);
    }
  
    async deleteUser(id) {
      return await userRepository.deleteUser(id);
    }

    async getFrames() {
       return await userRepository.getAllFrames();
    }

    async getAvatars() {
      return await userRepository.getAllAvatars();
    }

    async getLeagues(league){
      return await userRepository.getAllForLeague(league);
    }
  }
  
  module.exports = new UserService();
  
 