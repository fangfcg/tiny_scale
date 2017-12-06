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
    var endDate =  new Date(startDate.setDate(startDate.getDate() + dataArray.length));
    return {startDate: startDate, data:dataArray, endDate:endDate};
};