const express   = require("express")
const router    = express.Router();
const db        = require("./../db");
const {slugify, getDataForSql}   = require("../helpers")


/**
 * +GET:     terms      => Tüm terimleri getir. (&status=publish|trash)
 * +GET:     terms/:id  => ID' numarası verilen terimi getir.
 * -GET:     terms/:id/posts  => ID' numarası verilen terimin içeriklerini getir. todo: <=
 * +POST:    terms      => Yeni terim oluştur.
 * +PUT:     terms/:id  => ID'si verilen terimi güncellenecek.
 * +DELETE:  terms/:id  => ID'si verilen terimi silinecek.
 */

var allowedFields = ["tax_id", "term_title", "term_slug", "term_description", "term_parent", "term_order"];

function isAdmin(){
    // todo: admin giriş yaptı mı
    return true
}




// MIDDLEWARE
router.use( (request, response, next) => {
    let allowedMethods = ["GET"];
    if( allowedMethods.indexOf( request.method.toUpperCase() ) < 0  && !isAdmin()){
        return response.status(404).json({status:false, message:"not found"})
    }
    next();
} );



// TERİM LİSTESİ
router.get('/', (request, response)=>{
    let status    = request.query.status || null

    let sql     = `SELECT * FROM terms ORDER BY term_id DESC`;
    db.find(sql)
        .catch(error => { return response.json({status:false, ...error}) })
        .then(result => { return response.json({status:true, terms:result}) })
});




// TERİM BİLGİLERİNİ GETİR.
router.get('/:id', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response)

    let sql = `SELECT * FROM terms WHERE term_id=? LIMIT 1`;

    db.findOne(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => { return response.json({status:true, term:(result || {})}); })
});



// TERİM OLUŞTUR
router.post('/', (request, response)=>{
    // todo: request body yerine bir obje gelsin
    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            sqlDatas.term_slug = slugify(sqlDatas.term_title);
            let itemsOfSet = (Object.keys(sqlDatas).map( colname => colname+"=?" )).join(',');
            let sql = "INSERT INTO terms SET " + itemsOfSet;

            return db.exec(sql, Object.values(sqlDatas));
        })
        .then(resultCreate => {
            return db.findOne("SELECT * FROM terms WHERE term_id=? LIMIT 1", [resultCreate.insertId])
        })
        .then(resultFind => {
            return response.json({status:true, term: resultFind})
        })
        .catch(error => {
            return response.json({status:false, term:{}, ...error});
        })

});



/**
 * WORK:    UPDATE TERM
 * METHOD:  PUT
 */
router.put('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id)
        return responseNotFound(response)

    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            if( sqlDatas.hasOwnProperty('term_title') ){
                sqlDatas.term_slug = slugify(sqlDatas.term_title);
            }

            let itemsOfSet  = ( Object.keys(sqlDatas).map( colname => colname+"=?" ) ).join(",")

            return {
                sql: `UPDATE terms SET ${itemsOfSet} WHERE term_id=?`,
                datas: [...Object.values(sqlDatas), id]
            };
        })
        .then(  objForSql     => { return db.exec(objForSql.sql, objForSql.datas); })
        .then(  resultUpdate  => { return db.findOne("SELECT * FROM terms WHERE term_id=? LIMIT 1", [id]) ; })
        .then(  resultFind    => { return response.json({status:true, term:resultFind}) ; })
        .catch( error         => { return response.json({status:false, ...error}); } )
});



// todo: responseNotFound return edildikten sonra yinede sonraki then çalışıyor ve hata veriyor. çöz.
// TERİM SİL
router.delete('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id){
        return responseNotFound(response)
    }
    let term = {};

    db.findOne('SELECT * FROM terms WHERE term_id=? LIMIT 1', [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(resultSelect => {
            if( !Object.keys(resultSelect).length )
                return responseNotFound(response)

            term = resultSelect;
            return db.exec('DELETE FROM terms WHERE term_id=?', [id])
        })
        .then(function(){
            return response.json({status:true, term:term})
        } )

});





function responseNotFound(response, message="Not Found"){
    return response.json({status:false, message})
}





module.exports = router;