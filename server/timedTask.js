const model = require('./models/models').models;
const admin =  require('./api/admin');
const util = require('./utils');
//每隔一天清除缓存中的count
setInterval(timedTask, 86400000);

async function timedTask(){
    await admin.clearCertificateCount();
    await updateGroupStatData();
    await updateOperatorStatData();
}
/**
 * 更新客服组统计数据
 * 统计数据包括:会话量，消息数，人工接入率
 */
async function updateGroupStatData(){
    var groupList = await model.operatorGroup.find({});
    for(let i = 0; i < groupList.length; ++i){
        var group = groupList[i];
        var sessionCount = await util.cache.getAsync(`${util.STAT_SESS_GROUP}:${group.id}`);
        var msgCount = await util.cache.getAsync(`${util.STAT_MSG_GROUP}:${group.id}`);
        var manualCount = await util.cache.getAsync(`${util.STAT_MANUAL_GROUP}:${group.id}`);
        var commentCount = await util.cache.getAsync(`${util.STAT_COMMENT_GROUP}:${group.id}`);
        var satCount = await util.cache.getAsync(`${util.STAT_SATISFIED_GROUP}:${group.id}`);
        sessionCount = sessionCount || 0;
        msgCount = msgCount || 0;
        manualCount = manualCount || 0;
        commentCount = commentCount || 0;
        satCount = satCount || 0;
        var groupStatObj = {
            sessionCount:sessionCount,
            messageCount:msgCount,
            manualRate:manualCount / sessionCount,
            commentRate:commentCount / sessionCount,
            satisfiedRate: satCount / sessionCount,
        };
        group.serviceData.push(groupStatObj);
        await groupList[i].save();
        await util.cache.delAsync(`${util.STAT_MSG_GROUP}:${groupList[i].id}`);
        await util.cache.delAsync(`${util.STAT_SESS_GROUP}:${groupList[i].id}`);
        await util.cache.delAsync(`${util.STAT_MANUAL_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_COMMENT_GROUP}:${group.id}`);
        await util.cache.delAsync(`${util.STAT_SATISFIED_GROUP}:${group.id}`);
    }
}

async function updateOperatorStatData(){
    var opList = await model.operator.find({});
    for(var i = 0; i < opList.length; ++i){
        var op = opList[i];
        var sessCount = await util.cache.getAsync(`${util.STAT_SESS_OPERATOR}:${op.id}`);
        var msgCusCount = await  util.cache.getAsync(`${util.STAT_MSG_OP_REQ}:${op.id}`);
        var msgOpCount = await util.cache.getAsync(`${util.STAT_MSG_OP_RES}:${op.id}`);
        var queryCount = await util.cache.getAsync(`${util.STAT_OP_QA_TURNS}:${op.id}`);
        var delayTotal = await util.cache.getAsync(`${util.STAT_OP_QA_DELAY}:${op.id}`);
        var cmtOpCount = await util.cache.getAsync(`${util.STAT_COMMENT_OPERATOR}:${op.id}`);
        var satOpCount = await util.cache.getAsync(`${util.STAT_SATISFIED_OPERATOR}:${op.id}`);
        var statObj = {
            sessionCount:sessCount,
            qaRate:msgCusCount / msgOpCount,
            satisfiedRate:satOpCount / cmtOpCount,
            responseTime:delayTotal / queryCount,
        };
        op.serviceData.push(statObj);
        await op.save();
        await util.cache.getAsync(`${util.STAT_SESS_OPERATOR}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_MSG_OP_REQ}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_MSG_OP_RES}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_OP_QA_TURNS}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_OP_QA_DELAY}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_COMMENT_OPERATOR}:${op.id}`);
        await util.cache.getAsync(`${util.STAT_SATISFIED_OPERATOR}:${op.id}`);
    }
}