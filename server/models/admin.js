module.exports = (schema, mongoose) => {
    var adminSchema = new schema({
        name:String,
        pass:String,
        email:String,
        portrait:String,
        operatorGroupId:schema.Types.ObjectId,  //用作外键
    });
    return mongoose.model('admin', adminSchema);
};