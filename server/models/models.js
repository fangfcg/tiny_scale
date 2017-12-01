const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
var mongoose = require('mongoose');
var config = require('./dbconfig.json');

mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
//注意，由于存在operation buffering, 在连接后直接使用models不会报错，这样保证了只会连接一次
mongoose.connect(config.connectUrl, {useMongoClient:true});
var db = {};
var file_list = fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
});
file_list.forEach(file =>{
    var model = require(path.join(__dirname, file))(Schema, mongoose);
    db[model.modelName] = model;
  });
module.exports = db;