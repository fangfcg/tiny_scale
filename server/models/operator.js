module.exports = (schema, mongoose) => {
    var operatorSchema = new schema({
        name:String,
        pass:String,
        portrait:String,
        //sessionCounts: Array,
        //msgCounts: Array,
        email:String,
        serviceRecordStart:Date,
        operatorGroupId:schema.Types.ObjectId,  //用作外键
        quickReply:[String],
        serviceData:[schema.Types.Mixed]
    }, {usePushEach:true});
    return mongoose.model('operator', operatorSchema);
};