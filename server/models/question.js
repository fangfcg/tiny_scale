module.exports = (schema, mongoose) => {
    var questionSchema = new schema({
        name:String,
        content:String,
        similarities: Array,
        answer: String,
        cutterCache:Array,      //前面的部分是传给前端用于显示的，该部分用于自动问答机器人的回复
        operatorGroupId:schema.Types.ObjectId
    },{usePushEach:true});
    return mongoose.model('question', questionSchema);
};