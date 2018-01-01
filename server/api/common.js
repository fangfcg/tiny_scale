var session = require('../session');
const model = require('../models/models').models;
var util = require('../utils');
/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getSocketToken(req, res){
    var id = await session.getSessionId(req);
    res.json({token:id});
}
/**
 * 给定一个email,查找是否有管理员或者业务员已经注册了此邮箱
 * 如果在req.query里面没有email这个元素，则返回code:1
 * 如果在operator或者customer数据库中找到了相同的email，
 * 则返回duplicated：true
 * @param {*} req 
 * @param {*} res 
 */
async function emailCheck(req,res){
    req.body = req.query;
    if(!util.bodyContains(req, 'email')){
        res.json({code:1});
        return;
    }
    var email1 = await model.operator.findOne(req.body.email);
    var email2 = await model.customer.findOne(req.body.email);
    if(!(email1 || email2)){
        res.json({duplicated:false});
        return;
    }
    res.json({duplicated:true});
}

/**
 * 传入参数为{type: 用户类型，name:待检查用户名}
 * 检查该用户名是否已经被使用
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function nameCheck(req, res){
    if(!util.bodyContains(req, "type", "name")){
        res.json({success:false});
        return;
    }
    if(req.body.type === "admin"){
        //从admin的collection中进行查找
        var admin = await model.admin.findOne({name:req.body.name});
        res.json({duplicated: admin ? true: false});
    }
    else{
        //在operator中查找
        var operator = await model.operator.findOne({name:req.body.name});
        res.json({duplicated:operator ? true: false});
    }
}

module.exports.apiInterfaces = [
    {url:'/api/get_socket_token', callBack:getSocketToken, auth:true},
    {url:'/api/common/get_token',callBack:nameCheck},
    {url:'/api/common/is_email_used', callBack:emailCheck}
];