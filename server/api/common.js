var session = require('../session');
const model = require('../models/models').models;
const auth = require('../auth');
const bluebird = require('bluebird');
var util = require('../utils');
var stringGenerator = require('randomstring');
const config = require('../serverConfig.json');
/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getSessionId(req, res){
    var id = await session.getSessionId(req);
    res.json({session:id});
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
    var operator = await model.operator.findOne({email:req.body.email});
    var customer = await model.customer.findOne({email:req.body.email});
    if(!(operator || customer)){
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

/**
 * post 方法， 只修改name, pass,email，头像修改需要另设接口
 * @param {*} req 
 * @param {*} res
 */
async function profileUpdate(req,res){
    if(!util.bodyContains(req, 'name', 'email')){
        res.json({success:false});
        return;
    }
    req.user.name = req.body.name;
    req.user.email = req.body.email;
    await req.user.save();
    res.json({success:true});
}
/**
 * 前端传入邮箱和用户类型，参数格式{email: userType:}
 * 后端自动生成随机的验证码并发送邮件，如果发送成功则
 * 在缓存中以验证码为键保存用户类型和相应的id
 * @param {*} req 
 * @param {*} res
 */
const PREFIX_FIND_PASS = 'find_pass_certificate';

async function getCertificateFindPass(req, res){
    if(!util.bodyContains(req,'email', 'type')){
        res.json({success:false, err:"parameter email loss"});
        return;
    }
    if(req.body.type === 'admin'){
        var user = await model.admin.findOne({email:req.body.email});
    }
    if(req.body.type === 'operator'){
        var user = await model.operator.findOne({email:req.body.email});
    }
    if(!user){
        req.json({success:false, err:"user doesn't exists"});
        return;
    }
    var certificate = stringGenerator.generate({length:50});
    try {
        await util.mailTransporter.sendMail({
            to:req.body.email,
            subject: "小天秤在线客服用户找回密码",
            text: certificate
        });
    }
    catch(err){
        res.json({success:false});
        return;
    }
    //寄件成功，将验证码和userType和id保存在缓存中
    await util.cache.hsetAsync(`${PREFIX_FIND_PASS}:${certificate}`, 'type',req.body.type,'id',user.id);
    res.json({success:true});
}
/**
 * 前端传入一个验证码，参数类型{certificate}
 * 后端检查验证码是否存在，如果存在则在会话信息中保留userType和userId作为
 * 已经输入验证码的凭证
 * 读出验证码之后应该立刻清除
 * @param {*} req 
 * @param {*} res 
 */
async function certificateFindPass(req,res){
    if(!util.bodyContains(req, "certificate")){
        res.json({success:false});
        return;
    }
    var key = `${PREFIX_FIND_PASS}:${req.body.certificate}`;
    var type = await util.cache.hgetAsync(key, "type");
    var id = await util.cache.hgetAsync(key,"id");
    //无效的key的处理
    if(!type || !id){
        res.json({success:false, err:"invalid certificate"});
        return;
    }
    //删除cache中的验证码
    await util.cache.delAsync(key);
    //保存会话信息
    var findPass = {type:type, id:id};
    req.session.findPass = findPass;
    res.json({success:true});
    req.session.save();
}
/**
 * 前端向后端发送新密码，参数格式{certificate:}
 * 后端修改成功后返回{success:true}
 */
async function newPass(req,res){
    req.session.findPass = req.session.findPass || {};
    if(!util.bodyContains(req ,"newPass") || !req.session.findPass.type || !req.session.findPass.id){
        res.json({success:false});
        return;
    }
    if(req.session.findPass.type === 'admin'){
        var user = await model.admin.findById(req.session.findPass.id);
    }
    if(req.session.findPass.type === 'operator'){
        var user = await model.operator.findById(req.session.findPass.id);
    }
    user.pass = auth.Hash(req.body.newPass);    //未认证的用户的处理
    await user.save();
    res.json({success:true});
    return;
}
//设置头像文件上传配置
const multer = require('multer');
const path = require('path');
const adminPortraitDir = path.join(__dirname, '../',config.static.portrait.admin); 
const operatorPortraitDir =  path.join(__dirname, '../',config.static.portrait.operator);
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, req.user.userType === "admin" ? adminPortraitDir : operatorPortraitDir);
    },
    filename:function(req, file, cb){
        var filename = req.user.id + String(Date.now());
        req.fileName = filename;
        cb(null, filename);
    }
});
//头像修改设置
var upload = multer({storage: storage, limits:{fileSize:1000000}}).single("file");
upload = bluebird.promisify(upload);
async function uploadPortrait(req, res){
    await upload(req, res);
    var dirName = req.user.userType === "admin" ? config.static.portrait.admin : config.static.portrait.operator;
    req.user.portrait = path.join(dirName, req.fileName);
    await req.user.save();
    res.json({success: true, path: req.user.portrait});
}
//name email imgUrl
function getProfile(req, res){
    res.json({name:req.user.name, email:req.user.email, imgUrl:req.user.portrait});
}
var stringGenerator = require('randomstring');
//聊天文件上传接口
const chatFileStorage = multer.diskStorage({
    destination: path.join(__dirname, '../' ,config.static.chat),
    filename:function(req, file, cb){
        req.filename = stringGenerator.generate(50) + String(Date.now());
        cb(null, req.filename);
   }
});
var chatUpload = multer({storage: chatFileStorage, limits:{fileSize:1000000}}).single("file");
chatUpload = bluebird.promisify(chatUpload);
/**
 * 聊天时用户或者客服通过该接口上传文件，通过session中的socketAuth变量进行认证
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
async function chatFile(req, res){
    if(!req.session.socketAuthed){
        res.status(404);
    }
    await chatUpload(req, res);
    res.json({success:true, path: path.join(config.static.chat,req.filename)});
}

//name email imgUrl
function getProfile(req, res){
    res.json({name:req.user.name, email:req.user.email, imgUrl:req.user.portrait});
}


module.exports.apiInterfaces = [
    {url:'/api/get_session_id*', callBack:getSessionId},
    {url:'/api/common/is_email_used', callBack:emailCheck},
    {url:'/api/common/is_name_used', callBack:nameCheck},
    {url:'/api/common/settings/profile/*', callBack:profileUpdate, auth:true, method:'post'},
    {url:'/api/find_pass/get_certificate', callBack:getCertificateFindPass, method:'post'},
    {url:'/api/find_pass/certificate', callBack:certificateFindPass, method:'post'},
    {url:'/api/find_pass/new_pass', callBack:newPass, method:'post'},
    {url:'/api/upload_portrait', callBack:uploadPortrait, method:'post', auth:true},
    {url:'/api/get_profile*', callBack:getProfile, auth:true,},
    {url:'/api/upload_chat_file', callBack:chatFile, method:"post"},
];