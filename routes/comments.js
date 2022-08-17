var express = require("express");
var router  = express.Router();
var db      = require("../db");
var checkAuthForAdmin = require("../middlewares/checkAuthForAdmin")
const {slugify, getDataForSql}   = require("../helpers")



/**
 * +GET:     comments      => Tüm yorumları getir.. (&status=publish|trash)
 * +GET:     comments/:id  => ID' numarası verilen yorumu getir.
 * +POST:    comments      => Yeni yorum oluştur.
 * +PUT:     comments/:id  => ID'si verilen yorum güncellenecek.
 * +DELETE:  comments/:id  => ID'si verilen youm silinecek.
 */

var allowedFields = ["post_id", "user_id", "comment_content", "comment_email", "comment_person", "comment_status"];
var statusItems   = ['none', 'publish', 'trash'];

function isAdmin(){
    // todo: admin giriş yaptı mı
    return true
}

// YORUM LİSTESİ
router.get('/', (request, response)=>{
    let sqlFilter = {
        orderBy:    request.query.orderBy || "comment_id",
        sort:       request.query.sort || "DESC",
        status:     request.query.status || null,
    }

    //todo: querystringden gelen verilere göre filtreleme yapdır.

    let sql = "SELECT * FROM comments ORDER BY comment_id DESC";
    db.find(sql)
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        })
        .then(function(results){
            return response.status(200).json({status:true, comments:results});
        })
});


// TEK BİR YORUM
router.get('/:id', function(request, response){
    // todo: filtreleme işlemleri kullan (admin değilse publish olan görülür.)

    let sql = "SELECT * FROM comments WHERE comment_id=? LIMIT 1";
    db.findOne(sql, [request.params.id])
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        })
        .then(function(comment){
            return response.status(200).json({status:true, comment:comment});
        })
})




// YORUM OLUŞTUR
router.post("/", checkAuthForAdmin, function(request, response){
    //todo: Post'dan gelen değer değişkenini ekle
    getDataForSql(request.body, allowedFields)
        .then(function(sqlDatas){
            // todo: form kontrollerini yap
            let sql = "INSERT INTO comments SET " + Object.keys(sqlDatas).map(colName => colName+"=?").join(",")
            return db.exec(sql, Object.values(sqlDatas))
        })
        .then(function(resultInsert){
            let sql = "SELECT * FROM comments WHERE comment_id=?"
            return db.findOne(sql, [resultInsert.insertId])
        })
        .then(function(comment){
            return response.status(200).json({status:true, comment:comment});
        })
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        });
});


// yorum güncelle
router.put('/:id', checkAuthForAdmin, function(request, response){
    getDataForSql(request.body, allowedFields)
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        })
        .then(function(sqlDatas){
            let sqlUpdate = "UPDATE comments SET " +Object.keys(sqlDatas).map(colName => colName+"=?").join(',')+ " WHERE comment_id=?";
            return db.exec(sqlUpdate, [...Object.values(sqlDatas), request.params.id])
        })
        .then(function(resultUpdate){
            let sqlSelect = "SELECT * FROM comments WHERE comment_id=?";
            return db.findOne(sqlSelect, [request.params.id])
        })
        .then(function(comment){
            return response.status(200).json({status:true, comment:comment});
        })
});


// YORUM SİL
router.delete('/:id', checkAuthForAdmin, function(request, response){
    let sql = "SELECT * FROM comments WHERE comment_id=? LIMIT 1";
    let comment = {};
    db.findOne(sql, [request.params.id])
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        })
        .then(function(resultComment){
            comment = resultComment
            return db.exec("DELETE FROM comments WHERE comment_id=?", [request.params.id])
        })
        .then(function(deleteResult){
            return response.status(200).json({status:true, comment:comment});
        })
})




module.exports = router;