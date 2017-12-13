const expect = require('chai').expect;
const model = require('../models/models');
const server = require('../server');
const auth = require('../auth');

const config = require('../serverConfig.json');
var baseUrl = `http://localhost:${config.server.port}`;

describe('socket authentication', function(){
    before(dbInit);
    it('should reject socket connection', unAuthedCase);
    it('should accept socket', authedCase);
    after(clear);
});

async function clear(){
    await model.dropDatabase();
    await server.clearServerState();
}

async function dbInit(){
    var operatorGroup = new model.models.operatorGroup({
        name:'Group1',
        sessionCounts:[100, 300, 400],
        manualServiceRates:[0.5, 0.8, 1],
        msgCounts:[10, 10, 10],
        serviceRecordStart:Date.UTC(2017, 10, 12),
    });
    await operatorGroup.save();
    var admin = new model.models.admin({
        name:'admin',
        pass:auth.Hash('abcde'),
        operatorGroupId: operatorGroup.id,
    });
    await admin.save();
}
async function unAuthedCase(){
    //未进行认证时socket会被直接拒绝
    var socket = require('socket.io-client')(baseUrl, {reconnection:false});
    var res = await new Promise((resolve)=>{
        var timeObj = setTimeout(function(){
            resolve('no response');
        }, 1000);
        socket.on('disconnect', function(){
            clearTimeout(timeObj);
            resolve('disconnected');
        });
        socket.on('auth', function(){
            clearTimeout(timeObj);
            resolve('authed');
        });
    });
    expect(res).to.be.eq('disconnected');
}
async function authedCase(){
    var request = require('request');
    request = require('bluebird').promisify(request);
    request =  request.defaults({jar:true, simple:false, 
        resolveWithFullResponse:true, 
        json:true});
    var res = await request({
        url: baseUrl + '/login',
        method:'POST',
        body:{
            type:'admin',
            username:'admin',
            password:'abcde',
        }
    });
    expect(res.statusCode).to.be.eq(200, "login failed");
    res = await request({
        url:baseUrl + '/api/get_socket_token',
        method:'GET',
    });
    //结果存在res.body.token中
    var socket = require('socket.io-client')(baseUrl, 
        {reconnection:false,
        query:{token:res.body.token,
        type:'admin'}});
    var authed = await new Promise((resolve)=>{
        var timeObj = setTimeout(()=>{
            resolve(false);
        }, 1000);
        socket.on('auth', function(){
            clearTimeout(timeObj);
            resolve(true);
        });
    });
    expect(authed).to.be.eq(true, "authentication with token failed");
}