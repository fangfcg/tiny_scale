module.exports = (schema, mongoose) => {
    var chatLogSchema = new schema({
        operator:String,
        customer:String,
        type:Number,
        content:String,
        time:{type:Date, default:Date.now},
    });
    var chatLogModel = mongoose.model('chatLog', chatLogSchema);
    chatLogModel.contentType = {};
    //定义内容类型常量，注意当内容为文件或图片时content本身是一个链接，文件或者图片存储在服务器上
    chatLogModel.contentType.TEXT = 0;
    chatLogModel.contentType.PICTURE = 1;
    chatLogModel.contentType.FILE = 2;
    return chatLogModel;
};