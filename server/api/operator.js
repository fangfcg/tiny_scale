const util = require('../utils');
const model = require('../models/models').models;
const auth = require('../auth');
/**
 * post方法，前端发送验证码{certificate:},
 * 后端检验存在该验证码后返回{success:true}
 * 在session中记录该客服对应的客服组id
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function certificate(req, res){
    if(!util.bodyContains(req, 'certificate')){
        res.json({success:false});
        return;
    }
    var key = `${util.PREFIX_OPERATOR_CERTIFICATE}:${req.body.certificate}`;
    var certificate = await util.cache.hgetAsync(key, "opGroup");
    if(!certificate){
        res.json({success:false, err:"certificate not found"});
        return;
    }
    //删除该验证码
    await util.cache.delAsync(key);
    //在session中存储已经验证的信息
    req.session.signup = {opGroup:certificate};
    await req.session.saveAsync();
    res.json({success:true});
}
/**
 * post方法
 * 传入业务员的name,pass, email，系统检验已经验证，如果已经验证则
 * 创建业务员表
 * 返回{success:true}
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const path = require('path');
const config = require('../serverConfig.json');
async function createOperator(req, res){
    if(!util.bodyContains(req, 'name', 'pass', )){
        res.json({success:false});
        return;
    }
    //是否已经输入验证码
    if(!req.session.signup){
        res.status(404);
        return;
    }
    var operator = new model.operator({name:req.body.name,
        pass:auth.Hash(req.body.pass),
        email:req.body.email,
        operatorGroupId:req.session.signup.opGroup});
    req.session.signup = null;
    await req.session.saveAsync();
    operator.portrait = path.join(config.static.portrait.operator, 'default.jpg');
    await operator.save();
    res.json({success:true});
    return;
}
/**
 * get方法，返回req.user所在客服组所有成员（除掉自身）的身份信息和工作状态
 * {success:bool, colleagues:[{id, name, status:"working/resting/left"}]}
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function getColleagues(req, res){
    //获取所有id与自己不相同的colleague的doc
    var operators = await model.operator.find({operatorGroupId:req.user.operatorGroupId,
         _id:{$ne:req.user.id}});
    var results = [];
    for(let i = 0; i < operators.length; ++i){
        var tmp = {};
        var state = await util.cache.getAsync(`${util.PREFIX_OPERATOR_STATUS}:${operators[i].id}`);
        if(!state){
            tmp.state = "left";
        }
        else {
            tmp.state = state;
        }
        tmp.id = operators[i].id;
        tmp.name = operators[i].name;
        results.push(tmp);
    }
    res.json({success:true, colleagues:results});
}

async function getMsgList(req, res){
    //检验该客服是否当前正在处理某条消息
    var msgProcessing = await util.cache.getAsync(`${util.PREFIX_MESSAGE_OPERATOR}:${req.user.id}`);
    if(msgProcessing){
        var msg = await model.message.findById(msgProcessing);
        msg = util.doc2Object(msg);
        res.json({success:false, msg:msg});
        return;
    }
    //客服未处理任何消息
    var msgList = await model.message.find({operatorGroupId:req.user.operatorGroupId,
    answerState:model.message.STATE_UNANSWERED});
    var result = [];
    msgList.forEach(val =>{
        var tmp = util.doc2Object(val);
        tmp.id = val.id;
        result.push(tmp);
    });
    res.json({success:true, msg:result});
}
/**
 * post方法，传入参数为{id}，检查该留言是否已经被回答，如果是则返回true，否则false
 * @param {} req 
 * @param {*} res 
 */
async function getMsg(req, res){
    if(!util.bodyContains(req, "id")){
        res.json({success:false, err:"invalid parameter"});
    }
    var msg = await model.message.findOneAndUpdate({_id:req.body.id, answerState:model.message.STATE_UNANSWERED},
            {answerState:model.message.STATE_ANSWERING, answerOperatorId:req.user.id},{new:true});
    if(!msg){
        res.json({success:false});
        return;
    }
    //缓存中删掉客户留言未处理的记录，避免删除当前正在处理的留言
    await util.cache.delAsync(`${util.PREFIX_MESSAGE_LEFT}:${msg.customerId}`);
    //在缓存中记录客服正在处理该消息
    await util.cache.setAsync(`${util.PREFIX_MESSAGE_OPERATOR}:${req.user.id}`, msg.id);
    res.json({success:true, msg:util.doc2Object(msg)});
}
/**
 * 参数格式：{id:,content:}
 * @param {*} req 
 * @param {*} res 
 */
async function answerMsg(req, res){
    var msgId = await util.cache.getAsync(`${util.PREFIX_MESSAGE_OPERATOR}:${req.user.id}`);
    if(!util.bodyContains(req, 'answer')){
        res.json({success:false});
        return;
    }
    if(!msgId){
        res.json({success:false});
        return;
    }
    var msg = await model.message.findById(msgId);
    msg.answer = req.body.answer;
    msg.answerState = model.message.STATE_ANSWERED;
    msg.answerTime = Date.now();
    await msg.save();
    //该客服可以继续回复下一条留言
    await util.cache.delAsync(`${util.PREFIX_MESSAGE_OPERATOR}:${req.user.id}`);
    //在缓存中记录该留言已经被回答
    var msgId = String(msg.id);
    await util.cache.setAsync(`${util.PREFIX_MESSAGE_ANSWERED}:${msg.customerId}`, msgId);
    res.json({success:true});
}

/**
 * 快速回复处理函数
 */
function getOperatorReply(req, res){
    var result = [];
    if(req.user.quickReply){
        req.user.quickReply.forEach(val => {
            result.push({text:val});
        });
    }
    res.json({data:result, success:true});
}

async function getGroupReply(req, res){
    var group = await model.operatorGroup.findById(req.user.operatorGroupId);
    var result = [];
    if(group.quickReply){
        group.quickReply.forEach(val => {
            result.push({text:val});
        });
    }
    res.json({success:true, data:result});
}

async function updateReply(req, res){
    if(!util.bodyContains(req, 'data')){
        res.json({success:false});
    }
    var result = [];
    req.body.data.forEach(val => {
        result.push(val.text);
    });
    req.user.quickReply = result;
    await req.user.save();
    res.json({success:true});
}

module.exports.apiInterfaces = [
    {url:'/api/operator/signup/certificate', callBack:certificate, method:'post'},
    {url:'/api/operator/signup/create_operator',callBack:createOperator, method:'post'},
    {url:'/api/operator/get_colleagues', callBack:getColleagues, auth:true},
    {url:'/api/operator/get_left_msg_lst', callBack:getMsgList, auth:true},
    {url:'/api/operator/get_left_msg',callBack:getMsg, auth:true, method:'post'},
    {url:'/api/operator/answer_msg', callBack:answerMsg, auth:true, method:'post'},
    {url:'/api/operator/get_selfreply', callBack:getOperatorReply, auth:true},
    {url:'/api/operator/get_compreply', callBack:getGroupReply, auth:true},
    {url:'/api/operator/set_quickreply', callBack:updateReply, auth:true, method:'post'},
];