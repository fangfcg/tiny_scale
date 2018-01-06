const model = require('./models/models').models;
const admin =  require('./api/admin');
const util = require('./utils');
//每隔一天清除缓存中的count
setInterval(timedTask, 300000);
var date = new Date(Date.now());
async function timedTask(){
    var dtNow = new Date(Date.now());
    if(dtNow.getDate() != date.getDate());{
        await admin.clearCertificateCount();
        await updateGroupStatData();
        await updateOperatorStatData();
        date = dtNow;
    }
}
/**
 * 更新客服组统计数据
 * 统计数据包括:会话量，消息数，人工接入率
 */
async function updateGroupStatData(){
    var groupList = await model.operatorGroup.find({});
    for(let i = 0; i < groupList.length; ++i){
        var group = groupList[i];
        var sessionCount = await numfy(`${util.STAT_SESS_GROUP}:${group.id}`);
        var msgCount = await numfy(`${util.STAT_MSG_GROUP}:${group.id}`);
        var manualCount = await numfy(`${util.STAT_MANUAL_GROUP}:${group.id}`);
        var commentCount = await numfy(`${util.STAT_COMMENT_GROUP}:${group.id}`);
        var satCount = await numfy(`${util.STAT_SATISFIED_GROUP}:${group.id}`);
        var groupStatObj = {
            sessionCount:sessionCount,
            messageCount:msgCount,
            manualRate:sessionCount ? manualCount / sessionCount : 0,
            commentRate:sessionCount ? commentCount / sessionCount : 0,
            satisfiedRate: sessionCount ? satCount / sessionCount : 0,
        };
        group.serviceData.push(groupStatObj);
        await groupList[i].save();
        await util.cache.delAsync(`${util.STAT_MSG_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_SESS_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_MANUAL_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_COMMENT_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_SATISFIED_GROUP}:${group.id}`);
    }
}

async function updateOperatorStatData(){
    var opList = await model.operator.find({});
    for(var i = 0; i < opList.length; ++i){
        var op = opList[i];
        var sessCount = await numfy(`${util.STAT_SESS_OPERATOR}:${op.id}`);
        var msgCusCount = await numfy(`${util.STAT_MSG_OP_REQ}:${op.id}`);
        var msgOpCount = await numfy(`${util.STAT_MSG_OP_RES}:${op.id}`);
        var queryCount = await numfy(`${util.STAT_OP_QA_TURNS}:${op.id}`);
        var delayTotal = await numfy(`${util.STAT_OP_QA_DELAY}:${op.id}`);
        var cmtOpCount = await numfy(`${util.STAT_COMMENT_OPERATOR}:${op.id}`);
        var satOpCount = await numfy(`${util.STAT_SATISFIED_OPERATOR}:${op.id}`);
        var statObj = {
            sessionCount:sessCount,
            qaRate:msgCusCount ? msgCusCount / msgOpCount : 0,
            satisfiedRate:cmtOpCount ? satOpCount / cmtOpCount : 0,
            responseTime:queryCount ? delayTotal / queryCount : 0,
        };
        op.serviceData.push(statObj);
        await op.save();
        await util.cache.delAsync(`${util.STAT_SESS_OPERATOR}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_MSG_OP_REQ}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_MSG_OP_RES}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_OP_QA_TURNS}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_OP_QA_DELAY}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_COMMENT_OPERATOR}:${op.id}`);
        await util.cache.delAsync(`${util.STAT_SATISFIED_OPERATOR}:${op.id}`);
    }
}

async function numfy(key){
    var val = await util.cache.getAsync(key);
    return Number(val) || 0;
}