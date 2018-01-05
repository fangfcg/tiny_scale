module.exports = (schema, mongoose) => {
    var operatorGroupSchema = new schema({
        name:String,
        sessionCounts:[Number],
        msgCounts:[Number],
        serviceData:[schema.Types.Mixed],
        serviceRecordStart:Date,
        companySocketToken:String,
        specialRobotAnswer:schema.Types.Mixed,  //包含greet和unknown两个键
        robotPortrait:String,        //机器人头像默认地址
        quickReply:[String],
    });
    return mongoose.model('operatorGroup', operatorGroupSchema);
};