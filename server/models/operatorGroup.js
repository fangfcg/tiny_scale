module.exports = (schema, mongoose) => {
    var operatorGroupSchema = new schema({
        name:String,
        sessionCounts:[Number],
        msgCounts:[Number],
        serviceRecordStart:Date,
        companySocketToken:String,
    });
    return mongoose.model('operatorGroup', operatorGroupSchema);
};