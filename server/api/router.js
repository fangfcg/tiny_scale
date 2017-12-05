const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
var interfaces = [];
//每一个模块向外提供一个名为apiInterfaces的数组，每个元素为一个{url, callBack, auth, method}对象
fs.readdirSync(__dirname)
    .filter(file=>{
        return (file.indexOf('.') !== 0) 
        && (file !== basename) 
        && (file.slice(-3) === '.js');
    })
    .forEach(file=>{
        interfaces = interfaces.concat(require(path.join(__dirname, file)).apiInterfaces);
    });
//对验证行为进行封装
function authWrap(func){
    return (function (req, res, next){
        if(!req.isAuthenticated()){
            //未进行验证时的返回信息
            res.status(404);
            res.send('page not found');
        }
        else{
            return func(req, res, next);
        }
    });
}
module.exports.setRoute = function(app){
    interfaces.forEach(option=>{
        if(!option.url || !option.callBack || typeof(option.callBack) != 'function'){
            throw("apiInterfaces entry must contains url and callBack");
        }
        //默认采用get方法
        option.method = option.method || 'get';
        //如果需要验证才能接入则需要进行封装
        if(option.auth){
            option.callBack = authWrap(option.callBack);
        }
        app[option.method](option.url, option.callBack);
    });
};