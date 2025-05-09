const Avatar = require("../model/Avatar");
const Frame = require("../model/Frames");
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

    async getAllFrames(){
      return await Frame.find({});
    }

    async getAllAvatars(){
      return await Avatar.find({});
    }

    async getAllForLeague(league){
     return await User.find({ league }, '-partida').sort({ coins: -1 });
    }
  }
  
  module.exports = new UserRepository();
  