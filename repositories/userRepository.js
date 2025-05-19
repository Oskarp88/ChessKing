const User = require("../model/User");

class UserRepository {
    async getAllUsers() {
      return await User.find({},'-partida');
    }
  
    async getUserById(id) {
      return await User.findById(id, '-partida');
    }
    async getUserByIdAndSelectGames(id) { 
      return await  User.findById(id).select('partida'); 
    } 
    async getUserOne(email) {
      return await User.findOne({ email }).select('-partida');

    }
      
    async createUser(userData) {
      const user = new User(userData);
      return await user.save();
    }
  
    async updateUser(id, userData) {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    }
  
    async deleteUser(id) {
      return await User.findByIdAndDelete(id);
    }  
  }
  
  module.exports = new UserRepository();
  