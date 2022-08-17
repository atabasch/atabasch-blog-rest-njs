var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require("dotenv").config();

let routesPath = "./routes/";
let routers = {
    index:          require(routesPath + 'index'),
    users:          require(routesPath + 'users'),
    posts:          require(routesPath + 'posts'),
    taxonomies:     require(routesPath + "taxonomies"),
    terms:          require(routesPath + "terms"),
    menus:          require(routesPath + "menus"),
    menuItems:      require(routesPath + "menu-items"),
    comments:       require(routesPath + "comments"),
    contacts:       require(routesPath + "contacts"),
}


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',            routers.index);
app.use('/user',        routers.users);
app.use('/post',        routers.posts);
app.use('/comments',  routers.comments) ;    //+
app.use('/taxonomies',  routers.taxonomies);    //+
app.use('/terms',       routers.terms);         //+
app.use('/menus',       routers.menus);         //+
app.use('/menu-items',  routers.menuItems) ;    //+
app.use('/contacts',    routers.contacts)




app.get('/form', function(request, response){
    response.json({msg:"yav hehe"})
})
module.exports = app;
