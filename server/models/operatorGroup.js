module.exports = (schema, mongoose) => {
    var operatorGroupSchema = new schema({
        name:String,
        sessionCounts:[Number],
        manualServiceRates:[Number],
        msgCounts:[Number],
        serviceRecordStart:Date,
    });
    return mongoose.model('operatorGroup', operatorGroupSchema);
};