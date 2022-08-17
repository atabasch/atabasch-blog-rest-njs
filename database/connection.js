var {Sequelize} = require("sequelize");
var envDatas    = process.env;
const connect   = new Sequelize(envDatas.DBNAME, envDatas.DBUSER, envDatas.DBPASSWORD, {
    host: envDatas.DBHOST,
    dialect: "mysql"
})


module.exports = connect