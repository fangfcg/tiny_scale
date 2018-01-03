module.exports = (schema, mongoose) => {
    var message = new schema({
        customerId:schema.Types.ObjectId,
        content:String,
        leftTime:Date,
        answerState:Number,
        answerTime:Date,
        answer:String,
        answerOperatorId:schema.Types.ObjectId,
        operatorGroupId:schema.Types.ObjectId,
    });
    var model =  mongoose.model('message', message);
    model.STATE_UNANSWERED = 0;
    model.STATE_ANSWERING = 1;
    model.STATE_ANSWERED = 2;
    return model;
};