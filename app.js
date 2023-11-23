var express = require('express');
var path = require('path');
var session = require('express-session')
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var logger = require('morgan');

require("dotenv").config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false  }));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay }
}));


// app.use(bodyParser.urlencoded( { extended: false } ));
// app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

module.exports = app;
