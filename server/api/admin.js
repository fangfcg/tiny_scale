var model = require('../models/models').models;
var util = require('../utils');
var stringGenerator = require('randomstring');
var auth = require("../auth");
//restful格式{code, data, msg}, code 为0表示成功，非0表示失败
async function getGroupInfo(req, res){
    var map = {sessionCount:'sessionCounts',
        messageCount:'msgCounts'};
    req.body = req.query;
    req.body.id = req.user.id;
    var admin = req.user;
    var group = await model.operatorGroup.findById(admin.operatorGroupId);
    //根据dataType确定返回的数据类型
    if(!util.bodyContains(req, 'dataType')){
        //返回该管理员下面的全部客服的id和名称
        var operatorList = await model.operator.find(
            {operatorGroupId:group.id});
        var result = [];
        operatorList.forEach(element => {
            result.push({id:element.id, name:element.name});
        });
        res.json(result);
    }
    else{
        //返回服务数据
        var list = group[map[req.body.dataType]] || [];
        var result = util.wrapArrayData(group.serviceRecordStart, list);
        res.json(result);
    }
}

async function getOperatorInfo(req, res){
    req.body = req.query;
    var map = {sessionCount:'sessionCounts', messageCount:'msgCounts'};
    if(!util.bodyContains(req, 'id')){
        res.json({code:1});
        return;
    }
    var operator = await model.operator.findById(req.body.id);
    if(!operator){
        res.json({code:1, msg:'operator not found'});
        return;
    }
    //防止不同组的管理员获取客服的信息
    if(operator.operatorGroupId.toString() != req.user.operatorGroupId.toString()){
        res.json({code:1, msg:'not belong to same group'});
        return;
    }
    if(req.body.dataType){
        var list = operator[map[req.body.dataType]] || [];
        var result = util.wrapArrayData(operator.serviceRecordStart, list);
        res.json(result);
    }
}
/**
 * 前端传入邮箱，后端自动生成随机的验证码并发送邮件，如果发送成功则
 * 在缓存中保存该验证码和邮箱同时向前端返回success为true,否则false
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function getCertificate(req, res){
    if(!util.bodyContains(req,'email')){
        res.json({success:false, err:"parameter email loss"});
        return;
    }
    var certificate = stringGenerator.generate({length:50});
    try {
        await util.mailTransporter.sendMail({
            to:res.body.email,
            subject: "小天秤在线客服管理员注册",
            text: certificate
        });
    }
    catch(err){
        res.json({success:false});
        return;
    }
    //寄件成功，将验证码和邮箱保存在缓存中
    await util.cache.hsetAsync(`certificate:${certificate}`, 'email',res.body.email);
    res.json({success:true});
}
/**
 * 前端传入一个验证码，后端检查验证码是否存在，如果存在则在会话信息中保留email作为
 * 已经输入验证码的凭证
 * 读出验证码之后应该立刻清除
 * 注意一个客服组是在这里被第一次创建的
 * @param {*} req 
 * @param {*} res 
 */
async function certificate(req, res){
    if(!util.bodyContains(req, "certificate")){
        res.json({success:false});
        return;
    }
    var key = `certificate:${req.body.certificate}`;
    var email = await util.cache.hgetAsync(key, "email");
    if(!email){
        res.json({success:false, err:"invalid certificate"});
        return;
    }
    //删除cache中的验证码
    await util.cache.delAsync(key);
    //保存会话信息
    req.session.email = email;
    res.json({success:true});
    req.session.save();
}
/**
 * 前端传入创建管理员和客服组所需要的信息
 * name, pass, companyName,
 * 后端检查是否已经输入验证码,如果已经输入，
 * 则创建客服和客服组
 * 注意由于email已经被保存在后端所以该数据不是必须的
 * @param {*} req 
 * @param {*} res 
 */
async function createAdmin(req, res){
    if(!util.bodyContains(req , "name", "pass", "companyName") || req.session.email){
        res.json({success:false});
        return;
    }
    //管理员账号重名检查
    var admin = await model.admin.findOne({name:req.body.name});
    if(admin){
        req.json({success:false, err:"admin already exists"});
        return;
    }
    var opGroup = new model.operatorGroup({
        name:req.body.companyName,
    });
    await opGroup.save();
    //使用bcryptjs对密码进行加密存储
    admin = new model.admin({
        name:req.body.name,
        pass:auth.Hash(req.body.pass),
        email:req.session.email,
        operatorGroupId: opGroup.id
    });
    await admin.save();
    res.json({success:true});
    //取消认证状态
    req.session.email = null;
    req.session.save();
}

module.exports.apiInterfaces = [
    {url:'/api/admin/group_info', callBack:getGroupInfo, auth:true},
    {url:'/api/admin/operator_info', callBack:getOperatorInfo, auth:true},
    {url:'/api/admin/signup/get_certificate', callBack:getCertificate},
    {url:'/api/admin/signup/certificate', callBack:certificate},
    {url:'/api/admin/signup/create_admin', callBack:createAdmin},
];