const model = require('./models/models').models;
const admin =  require('./api/admin');
const util = require('./utils');
//每隔一天清除缓存中的count
setInterval(timedTask, 86400000);

async function timedTask(){
    await admin.clearCertificateCount();
    await updateGroupStatData();
}
/**
 * 更新客服组统计数据
 */
async function updateGroupStatData(){
    var groupList = await model.operatorGroup.find({});
    for(let i = 0; i < groupList.length; ++i){
        var sessionCount = await util.cache.getAsync(`${util.STAT_SESS_COUNT}:${groupList[i].id}`);
        var msgCount = await util.cache.getAsync(`${util.STAT_MSG_COUNT}:${groupList[i].id}`);
        sessionCount = sessionCount || 0;
        msgCount = msgCount || 0;
        groupList[i].sessionCounts.push(sessionCount);
        groupList[i].msgCounts.push(msgCount);
        await groupList[i].save();
        await util.cache.delAsync(`${util.STAT_MSG_COUNT}:${groupList[i].id}`);
        await util.cache.delAsync(`${util.STAT_SESS_COUNT}:${groupList[i].id}`);
    }
}