const express   = require("express");
const router    = express.Router();
const db = require("../db");

const allowedFields = ["id", "title", "description", "content", "image", "status", "c_time", "u_time", "d_time"];


router.get('/', function(request, response){
    let select = request.query.fields || "*"

    if(select != "*"){

    }

    let cursor = db.connect(err => {
        let sql = `SELECT ${select} FROM makaleler`;
        db.query(sql, (err, result) => {
            response.json({results: result})
        })
    });
});


module.exports = router;