const chatRepository = require("../repositories/chatRepository");

class ChatService {
    async getChat(data){
      return await chatRepository.getChatFindOne(data);
    }
    async createChat(chatData){
      return await chatRepository.createChat(chatData);
    }
    async getMessage(chatId){
      return await chatRepository.getMessageFindOne(chatId);
    }
    async createMessage(data){
      return await chatRepository.createMessage(data);
    }
}

module.exports = new ChatService();