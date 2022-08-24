var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

require("dotenv").config();

let routesPath = "./routes/";
let routers = {
    posts:          require(routesPath + 'posts'),
    taxonomies:     require(routesPath + "taxonomies"),
    terms:          require(routesPath + "terms"),
    menus:          require(routesPath + "menus"),
    menuItems:      require(routesPath + "menu-items"),
}


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false  }));

app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));
app.use('/posts',        routers.posts);
app.use('/taxonomies',  routers.taxonomies);    //+
app.use('/terms',       routers.terms);         //+
app.use('/menus',       routers.menus);         //+
app.use('/menu-items',  routers.menuItems) ;    //+

module.exports = app;
