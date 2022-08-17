const mysql = require("mysql2");
const config = require("./config")
var envDatas = process.env;

const db    = mysql.createConnection({
    host:       envDatas.DBHOST,
    user:       envDatas.DBUSER,
    password:   envDatas.DBPASSWORD,
    database:   envDatas.DBNAME,
    port:       envDatas.DBPORT,
    charset:    envDatas.DBCHARSET
})

module.exports.db = db

module.exports.find = function(sql, datas=[]){

    return new Promise(function(success, error){

            db.query(sql, datas, function(err, results, fields){

                if(err){
                    error(err);
                    return;
                }

                success(results, fields);
                return;

            });

    });

} // find


module.exports.findOne = function(sql, datas=[]){

    return new Promise(function(success, error){

        db.query(sql, datas, function(err, results, fields){

            if(err){
                error(err);
                return;
            }

            let result = results.length? results[0] : {}
            success(result, fields);
            return;

        });

    });

} // find



module.exports.exec = function(sql, datas=[]){
    return new Promise(function(success, error){

        db.execute(sql, datas, function(err, results){
            if(err){
                error(err);
                return;
            }

            success(results);
            return;
        });

    });
} // insert