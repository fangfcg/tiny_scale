const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
var mongoose = require('mongoose');
var config = require('../serverConfig.json');

mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
//注意，由于存在operation buffering, 在连接后直接使用models不会报错，这样保证了只会连接一次
const url = process.env.IS_TEST ? config.db.testUrl : config.db.productUrl;
var db = {};
var file_list = fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) 
      && (file !== basename) 
      && (file.slice(-3) === '.js') 
      && !(file.toLowerCase().includes("test"));
});
file_list.forEach(file =>{
    var model = require(path.join(__dirname, file))(Schema, mongoose);
    db[model.modelName] = model;
  });
module.exports.models = db;
module.exports.dropDatabase = async function(){
  if(process.env.IS_TEST){
    await mongoose.connection.dropDatabase();
  }
};
module.exports.disconnect = async function(){
  await mongoose.disconnect();
};
module.exports.connect = async function(){
  await mongoose.connect(url, {useMongoClient:true});
};