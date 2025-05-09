const Chat = require("../model/Chat");
const Message = require("../model/Message");

class ChatRepository {
  async getChatFindOne(data){
    return await Chat.findOne(data);
  }
  async createChat(chatData) {
    const chat = new Chat(chatData);
    return await chat.save();
  }
  async getMessageFindOne(chatId){
    return await Message.find({chatId})
  }
  async createMessage(data){
    const message = await Message(data);
    return await message.save();
  }
}

module.exports = new ChatRepository();