var express = require('express');

var app = express();

app.get('/', function(req, res, next){
    res.send('<p>hello</p>');
    next();
});

var models = require('./models/models');
console.log(1);