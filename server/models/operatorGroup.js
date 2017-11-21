module.exports = (schema, mongoose) => {
    var operatorGroupSchema = new schema({
        name:String,
    });
    return mongoose.model('operatorGroup', operatorGroupSchema)
};