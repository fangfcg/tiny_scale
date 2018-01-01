const cutter = require('nodejieba');
const util = require('../utils');
const model = require('../models/models').models;
/**
 * 管理员向数据库中添加问题
 * @param {*} req 
 * @param {*} res 
 */
async function addQuestion(req, res){
    if(!util.bodyContains(req, 'name', 'content', 'similarities', 'answer')){
        res.json({success:false});
        return;
    }
    var question = new model.question({name:req.body.name,
         content:req.body.content,
        similarities:req.body.similarities,
        answer:req.body.answer});
    //对question的问题和相似问题进行分词
    getCutterCache(question);
    await question.save();
    res.json({success:true});
    return;
}
/**
 * post 方法，传入问题id，从问题collection中删除该问题
 * @param {*} req 
 * @param {*} res 
 */
async function delQuestion(req, res){
    if(!util.bodyContains(req, 'id')){
        res.json({success:false});
        return;
    }
    await model.question.findByIdAndRemove(req.body.id);
    res.json({success:true});
}
/**
 * get 方法，向前端返回该管理员公司中所有的问题的列表(name content similarities answer)
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function getQuestions(req, res){
    var questions = await model.question.find({operatorGroupId:req.user.operatorGroupId});
    var result = [];
    questions.forEach(ele => {
        var tmp = util.doc2Object(ele);
        tmp.cutterCache = null;
        tmp.operatorGroupId = null;
        result.push(tmp);
    });
    res.json(questions);
    return;
}
/**
 * 给定id和问题详情，对问题进行修改并重新分词
 * @param {Express.Response} res 
 * @param {Express.Request} req 
 */
async function modifyQuestion(req, res){
    if(!util.bodyContains(req, 'id', 'name', 'content', 'similarities', 'answer')){
        res.json({success:false});
        return;
    }
    var question = await model.question.findById(req.body.id);
    if(!question){
        res.json({success:false, err:'queston not found'});
    }
    question.name = req.body.name;
    question.content = req.body.content;
    question.similarities = req.body.similarities;
    question.answer = req.body.answer;
    getCutterCache(question);
    await question.save();
    res.json({success:true});
}

function getCutterCache(question){
    var descriptions = question.similarities.concat(question.content);
        var wordBag = new Set();
        for(var i = 0; i < descriptions.size; ++i){
            cutter.cut(descriptions[i]).forEach(word => {
                if(word.size !== 1){
                    wordBag.add(word);
                }
            });
        }
        //将分词结果保留在question中
        question.cutterCache = Array.from(wordBag);
}

module.exports.apiInterfaces = [
    {url:'/api/robot/add', callBack:addQuestion, method:'post', auth:true, type:'admin'},
    {url:'api/robot/del', callBack:delQuestion, method:'post', auth:true, type:'admin'},
    {url:'/api/robot/get_question_list', callBack:getQuestions, auth:true, type:'admin'},
    {url:'/api/robot/modify', callBack:modifyQuestion, method:'post', auth:true, type:'admin'}
];