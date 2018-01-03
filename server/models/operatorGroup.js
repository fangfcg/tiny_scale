module.exports = (schema, mongoose) => {
    var operatorGroupSchema = new schema({
        name:String,
        sessionCounts:[Number],
        msgCounts:[Number],
        serviceRecordStart:Date,
        companySocketToken:String,
        specialRobotAnswer:schema.Types.Mixed,  //包含greet和unknown两个键
        robotPortrait:String        //机器人头像默认地址
    });
    return mongoose.model('operatorGroup', operatorGroupSchema);
};