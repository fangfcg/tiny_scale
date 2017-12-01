module.exports = (schema, mongoose) => {
    var operatorSchema = new schema({
        name:String,
        pass:String,
        operatorGroup:String,
    });
    return mongoose.model('operator', operatorSchema);
};