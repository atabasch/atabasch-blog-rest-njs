const express   = require("express")
const router    = express.Router();
const db        = require("./../db");
const {slugify, getDataForSql}   = require("../helpers")


/**
 * +GET:     taxonomies      => Tüm taksonomileri getir. (&status=publish|trash)
 * +GET:     taxonomies/:id  => ID' numarası verilen taksonomiyi getir.
 * +GET:     taxonomies/:id /terms => ID' numarası verilen taksonomini terimlerini getir.
 * +POST:    taxonomies      => Yeni taksonomi oluştur.
 * +PUT:     taxonomies/:id  => ID'si verilen taksonomi güncellenecek.
 * +DELETE:  taxonomies/:id  => ID'si verilen taksonomi silinecek.
 */

var allowedFields = ["tax_title", "tax_slug", "tax_description", "tax_status"];

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



// TAKSONOMİ LİSTESİ
router.get('/', (request, response)=>{
    let status    = request.query.status || null

    let sqlWhere = ` WHERE tax_status='publish'`
    if(isAdmin()){
        sqlWhere = !(request.query.status || false)? '' : ` WHERE tax_status='${request.query.status}'`;
    }
    let sql     = `SELECT * FROM taxonomies ${sqlWhere} ORDER BY tax_id DESC`;

    db.find(sql)
        .catch(error => { return response.json({status:false, ...error}) })
        .then(result => { return response.json({status:true, taxonomies:result}) })
});


// TAKSONOMİ BİLGİLERİNİ GETİR.
router.get('/:id', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response, "Taksonomi bulunamadı")

    let sqlWhere = ` AND tax_status='publish'`
    if(isAdmin()){
        sqlWhere = !(request.query.status || false)? '' : ` AND tax_status='${request.query.status}'`;
    }
    let sql = `SELECT * FROM taxonomies WHERE tax_id=? ${sqlWhere} LIMIT 1`;

    db.find(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => { return response.json({status:true, taxonomy:(result[0] || {})}); })
});


// TAKSONOMİ OLUŞTUR
router.post('/', (request, response)=>{
    // todo: request body yerine bir obje gelsin
    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            sqlDatas.tax_slug = slugify(sqlDatas.tax_title);
            let itemsOfSet = (Object.keys(sqlDatas).map( colname => colname+"=?" )).join(',');
            let sql = "INSERT INTO taxonomies SET " + itemsOfSet;

            return db.exec(sql, Object.values(sqlDatas));
        })
        .then(resultCreate => {
            return db.findOne("SELECT * FROM taxonomies WHERE tax_id=? LIMIT 1", [resultCreate.insertId])
        })
        .then(resultFind => {
            return response.json({status:true, taxonomy: resultFind})
        })
        .catch(error => {
            return response.json({status:false, taxonomy:{}, ...error});
        })

});



/**
 * WORK:    UPDATE TAXONOMY
 * METHOD:  GET
 */
router.put('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id)
        return responseNotFound(response)

    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            if( sqlDatas.hasOwnProperty('tax_title') ){
                sqlDatas.tax_slug = slugify(sqlDatas.tax_title);
            }

            let itemsOfSet  = ( Object.keys(sqlDatas).map( colname => colname+"=?" ) ).join(",")

            return {
                sql: `UPDATE taxonomies SET ${itemsOfSet} WHERE tax_id=?`,
                datas: [...Object.values(sqlDatas), id]
            };
        })
        .then(  objForSql     => { return db.exec(objForSql.sql, objForSql.datas); })
        .then(  resultUpdate  => { return db.findOne("SELECT * FROM taxonomies WHERE tax_id=? LIMIT 1", [id]) ; })
        .then(  resultFind    => { return response.json({status:true, taxonomy:resultFind}) ; })
        .catch( error         => { return response.json({status:false, ...error}); } )
});

// TAKSONOMİ SİL
router.delete('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id){
        return responseNotFound(response)
    }
    let taxonomy = {};

    db.findOne('SELECT * FROM taxonomies WHERE tax_id=? LIMIT 1', [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(resultSelect => {
            if( !Object.keys(resultSelect).length ){
                return responseNotFound(response)
            }
            taxonomy = resultSelect;
            return db.exec('DELETE FROM taxonomies WHERE tax_id=?', [id])
        })
        .then(resultDelete => { return response.json({status:true, taxonomy:taxonomy}) } )

});





function responseNotFound(response, message="Not Found"){
    return response.json({status:false, message})
}





module.exports = router;