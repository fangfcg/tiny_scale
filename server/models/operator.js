module.exports = (schema, mongoose) => {
    var operatorSchema = new schema({
        name:String,
        pass:String,
        operatorGroupId:schema.Types.ObjectId,  //用作外键
    });
    return mongoose.model('operator', operatorSchema);
};