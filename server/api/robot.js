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
                if(word.size > 1){
                    wordBag.add(word);
                }
            });
        }
        //将分词结果保留在question中
        question.cutterCache = Array.from(wordBag);
}
/**
 * post 方法，用于设置机器人的特殊问答
 * 当前支持问候，回答不出来时的反应
 * 输入参数{type:设置特殊回答的名称，content}
 * @param {*} req 
 * @param {*} res 
 */
async function setSpecialAnswer(req, res){
    if(!util.bodyContains(req, "type")){
        res.json({success:false});
        return;
    }
    var opGroup = await model.operatorGroup.findById(req.user.operatorGroupId);
    opGroup.sepcialRobotAnswer[req.body.type] = req.body.content;
    await opGroup.save();
    res.json({success:true});
    return;
}

/**
 * 输入问题和客服组id，返回客服组管理员定义问题中距离question最近的一个问题的答案
 * 使用问题中的cutterCache
 * 设置一个阈值，当距离均低于此阈值时则返回operatorGroup中的unknown选项
 * @param {*} question 
 * @param {*} groupId 
 */
const PICCARD_THRESHOLD = 0.5;
async function getAutoAnswer(question, groupId){
    var questionLst = await model.question.find({operatorGroupId:groupId});
    var group = await model.operatorGroup.findById(groupId);
    //对传入的question进行分词
    var qSet = new Set();
    cutter.cut(question).forEach(val=>{
        if(val.size > 1)
            qSet.add(val);
    });
    //计算最大Piccard距离
    var dMax = 0, result, intersect = 0;
    for(let i = 0; i < questionLst.size; ++i){
        questionLst[i].cutterCache.forEach(val =>{
            if(qSet.has(val))
                ++intersect;
        });
        var distance = intersect / (qSet.size + questionLst[i].hcutterCache.size - intersect);
        if(distance > PICCARD_THRESHOLD && distance > dMax){
            dMax = distance;
            result = questionLst[i].answer;
        }
    }
    if(!dMax){
        //没有高于阈值的相似性答案
        result = group.sepcialRobotAnswer.unknown;
    }
    return result;
}

module.exports.apiInterfaces = [
    {url:'/api/robot/add', callBack:addQuestion, method:'post', auth:true, type:'admin'},
    {url:'api/robot/del', callBack:delQuestion, method:'post', auth:true, type:'admin'},
    {url:'/api/robot/get_question_list', callBack:getQuestions, auth:true, type:'admin'},
    {url:'/api/robot/modify', callBack:modifyQuestion, method:'post', auth:true, type:'admin'},
    {url:'/api/robot/set_special', callBack:setSpecialAnswer, method:'post', auth:true, type:'admin'},
];
module.exports.getAutoAnswer = getAutoAnswer;