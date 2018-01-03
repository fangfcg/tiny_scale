module.exports = (schema, mongoose) => {
    var operatorSchema = new schema({
        name:String,
        pass:String,
        portrait:String,
        sessionCounts: Array,
        msgCounts: Array,
        serviceRecordStart:Date,
        operatorGroupId:schema.Types.ObjectId,  //用作外键
    });
    return mongoose.model('operator', operatorSchema);
};