module.exports = (schema, mongoose) => {
    var chatLogSchema = new schema({
        operatorId:schema.Types.ObjectId,
        customerId:schema.Types.ObjectId,
        startTime:Date,
        endTime:Date,
        contents:[{msg:{type:{type:String}, content:String, time:Date},
            sender:String}],    //sender为customer,或者operator表示相应的发送人
        comment:Number,
    });
    var chatLogModel = mongoose.model('chatLog', chatLogSchema);
    chatLogModel.contentType = {};
    //定义内容类型常量，注意当内容为文件或图片时content本身是一个链接，文件或者图片存储在服务器上
    chatLogModel.contentType.TEXT = 0;
    chatLogModel.contentType.PICTURE = 1;
    chatLogModel.contentType.FILE = 2;
    return chatLogModel;
};