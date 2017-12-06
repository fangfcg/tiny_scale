module.exports = (schema, mongoose) => {
    var customerSchema = new schema({
        operatorGroup:String,  //表示operatorGroup的id
    });
    return mongoose.model('customer', customerSchema);
};