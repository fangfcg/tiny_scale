const model = require('../models/models').models;
var chatLogPool = {};

/**
 * chatLog对象的生成模块，所有的chatLog在未保存（调用finish方法）之前都保留在内存中，
 */

/**
 * 创建一个聊天记录对象，返回该对象的id，
 */
function createChat(customerId, operatorId){
    var chat = new model.chatLog({operatorId:operatorId,
         customerId:customerId,
        startTime:Date.now(),});
    chatLogPool[chat.id] = chat;
    return chat.id;
};
/**
 * 从内存中删除该id指向的Chat对象
 */
function withDrawChat(chatId){
    chatLogPool[chatId] = null;
}
/**
 * 有一方发送了新消息，msg为{type, content}类型的对象，senderType为"customer"或者"operator"
 */
function newMsg(chatId, msg, senderType){
    chatLogPool[chatId].contents.push({msg:msg,sender:senderType});
}
/**
 * 插入
 */
function commentChat(chatId, comment){
    chatLogPool[chatId].comment = comment;
}

async function finishChat (chatId) {
    await chatLogPool[chatId].save();
}

module.exports.createChat = createChat;
module.exports.withDrawChat = withDrawChat;
module.exports.newMsg = newMsg;
module.exports.commentChat = commentChat;
module.exports.finishChat = finishChat;