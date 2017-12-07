const bcrypt = require('bcryptjs');
const model = require('./models/models').models;
const fs = require('fs');
const path = require('path');
var salt = fs.readFileSync(path.join(__dirname,'salt.log')).toString();

//配置认证机制
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy({passReqToCallback:true},async function(req ,username, pass, done){
    if(req.body.type == 'admin'){adminAuth(req, username, pass, done);}
    else{operatorAuth(req, username, pass, done);}  
}));
//匹配规则设定
async function adminAuth(req, username, pass, done){
    try{
        var admin = await model.admin.findOne({name:username});
    }
    catch(e){
        return done(e);
    }
    //未找到用户或者密码不匹配
    if(!admin || !bcrypt.compareSync(pass, admin.pass)){return done(null, false);}
    admin.userType = 'admin';
    return done(null, admin);
}
async function operatorAuth(req, username, pass, done){
    try{
        var operator = await model.operator.findOne({name:username});
    }
    catch(e){
        return done(e);
    }
     //未找到用户或者密码不匹配 
    if(!operator || !bcrypt.compareSync(pass, operator.pass)){return done(null, false);}
    operator.userType = 'operator';
    return done(null, operator);
}
//串行化设置
passport.serializeUser(function(user, done){
    var repr = {userType: user.userType, id:user.id};
    return done(null, repr);
});
passport.deserializeUser(async function(repr, done){
    if(repr.userType == 'admin'){
        try{var admin = await model.admin.findById(repr.id);}
        catch(e){return done(e);}
        admin.userType = 'admin';
        return done(null, admin);
    }
    else{
        try{var operator = await model.operator.findById(repr.id);}
        catch(e){return done(e);}
        operator.userType = 'operator';
        return done(null, operator);
    }
});

module.exports.Hash = function(str){
    return bcrypt.hashSync(str, salt);
};
module.exports.Compare = function(str, hash){
    return bcrypt.compareSync(str, hash);
};
module.exports.configApp = function(app){
    app.use(passport.initialize());
    app.use(passport.session());
    //临时验证接口
    app.post('/login', passport.authenticate('local'), function(req, res){
        res.status(200).send('login ok');
    });
};