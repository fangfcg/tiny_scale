const model = require('../models/models').models;
var chatLogPool = {};

/**
 * chatLog对象的生成模块，所有的chatLog在未保存（调用finish方法）之前都保留在内存中，
 */

/**
 * 创建一个聊天记录对象，返回该对象的id，
 */
function createChat(customerId, operatorId, operatorGroupId){
    var chat = new model.chatLog({operatorId:operatorId,
        customerId:customerId,
        operatorGroupId:operatorGroupId,
        startTime:Date.now(),
        commented:false,
        crossed:false});
    chatLogPool[chat.id] = chat;
    return chat.id;
};
/**
 * 从内存中删除该id指向的Chat对象
 */
function withDrawChat(chatId){
    delete chatLogPool[chatId];
}
/**
 * 有一方发送了新消息，msg为{type, content}类型的对象，senderType为"customer"或者"operator"
 */
function newMsg(chatId, msg, senderType){
    if(chatLogPool[chatId]){
        //对传入的消息对象进行转换
        var msgObj = {};
        msgObj.content = msg.msg;
        msgObj.type = msg.isPicture ? "picture" : "text";
        msgObj.time = msg.time;
        chatLogPool[chatId].contents.push({msg:msgObj,sender:senderType});
    }
}
/**
 * 插入
 */
function commentChat(chatId, comment){
    if(chatLogPool[chatId]){
        chatLogPool[chatId].comment = comment;
        chatLogPool[chatId].commented = true;
    }
}

async function finishChat (chatId, options) {
    if(!chatLogPool[chatId])
        return;
    var chat = chatLogPool[chatId];
    options = options || {};
    chat.endTime = Date.now();
    if(options.crossed){
        chat.crossed = true;
        chat.crosserId = options.crosserId;
    }
    await chatLogPool[chatId].save();
    delete chatLogPool[chatId];
}

module.exports.createChat = createChat;
module.exports.withDrawChat = withDrawChat;
module.exports.newMsg = newMsg;
module.exports.commentChat = commentChat;
module.exports.finishChat = finishChat;