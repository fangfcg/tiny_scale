//缓存对象设置
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();    //暂时采用默认配置
module.exports.cache = client;
//定义各类缓存的前缀
module.exports.PREFIX_CERTIFICATE_COUNT = "certificate_gen_count";
module.exports.PREFIX_OPERATOR_CERTIFICATE ="operator_certificate"; 
module.exports.PREFIX_SOCKET_CLIENT = "socket_client";
module.exports.PREFIX_OPERATOR_STATUS = "operator_status";
module.exports.PREFIX_MESSAGE_OPERATOR = "message_operator";
module.exports.PREFIX_MESSAGE_LEFT = "message_left";
module.exports.PREFIX_MESSAGE_ANSWERED = "message_answered";
module.exports.STAT_SESS_GROUP = "stat_sess_group";   //每接入一个socket会话量+1
module.exports.STAT_MSG_GROUP = "stat_msg_group";     //客户每发送一条消息+1
module.exports.STAT_MANUAL_GROUP = "stat_manual_group";     //客服每接入一个客户+1
module.exports.STAT_COMMENT_GROUP = "stat_comment_group";   //每有一个用户评价+1
module.exports.STAT_SATISFIED_GROUP = "stat_satisfied_group";   //每有一个用户评价在3分以上在则+1
module.exports.STAT_SESS_OPERATOR = "stat_sess_operator";
module.exports.STAT_MSG_OP_REQ = "stat_msg_op_req";     //单个客服收到的消息
module.exports.STAT_MSG_OP_RES = "stat_msg_op_res";     //单个客服回复的消息
module.exports.STAT_OP_QA_DELAY = "stat_qa_delay_operator";
module.exports.STAT_OP_QA_TURNS = "stat_qa_turns_operator";
module.exports.STAT_COMMENT_OPERATOR = "stat_comment_operator";
module.exports.STAT_SATISFIED_OPERATOR = "stat_satisfied_operator";


module.exports.SATISFACTORY_THRESHOLD = 3;      //评分满意度阈值
//邮件服务对象配置
const nodemailer = require('nodemailer');
const mailConfig = require('./serverConfig.json').mail;
const transporter = nodemailer.createTransport(mailConfig.smtpConfig,mailConfig.default);
module.exports.mailTransporter = transporter;

module.exports.bodyContains =  function bodyContains(req){
    if(!req.body){
        return false;
    }
    var stringList = Array.from(arguments).slice(1);
    var flag = true;
    stringList.forEach(ele=>{
        if(!req.body[ele]){
            flag = false;
        }
    });
    return flag;
};
module.exports.doc2Object = function(document){
    var customObj = {};
    Object.keys(document.toObject()).filter(attr=>{
        return !attr.startsWith('_');
    }).forEach(attr=>{
        customObj[attr] = document[attr];
    });
    return customObj;
};

/**
 * 
 * @param {Date} startDate 
 * @param {Array} dataArray 
 */
module.exports.wrapArrayData = function(startDate, dataArray){
    dataArray = Array.from(dataArray);
    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + dataArray.length);
    return {startDate: startDate, data:dataArray, endDate:endDate};
};