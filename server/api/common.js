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
module.exports.apiInterfaces = [
    {url:'/api/get_socket_token', callBack:getSocketToken, auth:true},
    {url:'/api/common/is_email_used',callBack:emailCheck},
];