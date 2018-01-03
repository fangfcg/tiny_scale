module.exports = (schema, mongoose) => {
    var customerSchema = new schema({
        operatorGroupId:schema.Types.ObjectId,  //表示operatorGroup的id
    });
    return mongoose.model('customer', customerSchema);
};