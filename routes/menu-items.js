const express   = require("express")
const router    = express.Router();
const db        = require("./../db");
const {slugify, getDataForSql}   = require("../helpers")


/**
 * +GET:     menu-items      => Tüm menüleri getir. (&status=publish|trash)
 * +GET:     menu-items/:id  => ID' numarası verilen menüyü getir.
 * -GET:     menu-items/:id  => ID' numarası verilen menünün itemlerini getir.
 * +POST:    menu-items      => Yeni menü oluştur.
 * +PUT:     menu-items/:id  => ID'si verilen menüyü güncellenecek.
 * +DELETE:  menu-items/:id  => ID'si verilen menüyü silinecek.
 */

var allowedFields = ["menu_id", "term_id", "meit_parent", "meit_title", "meit_path", "meit_order", "meit_data"];

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



// MENU LİSTESİ
router.get('/', (request, response)=>{
    let status    = request.query.status || null
    let sql       = `SELECT * FROM menu_items ORDER BY meit_id DESC`;
    db.find(sql)
        .catch(error => { return response.json({status:false, ...error}) })
        .then(result => { return response.json({status:true, items:result}) })
});




// MENU BİLGİLERİNİ GETİR.
router.get('/:id', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response)

    let sql = `SELECT * FROM menu_items WHERE meit_id=? LIMIT 1`;

    db.findOne(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => { return response.json({status:true, item:(result || {})}); })
});




// MENU BİLGİLERİNİ ve itemlerini GETİR.
router.get('/:id/menu', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response)

    let sql = `SELECT * FROM menus WHERE menu_id=? LIMIT 1`;

    let item = {}
    db.findOne(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => {
            item = result;
            return db.find("SELECT * FROM menu_items WHERE menu_id=? ORDER BY meit_order ASC", [id])
        })
        .then(resultItems => {
            return response.json({status:true, menu: (item || {})} );
        });
});






// MENU OLUŞTUR
router.post('/', (request, response)=>{
    // todo: request body yerine bir obje gelsin
    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            let itemsOfSet = (Object.keys(sqlDatas).map( colname => colname+"=?" )).join(',');
            let sql = "INSERT INTO menu_items SET " + itemsOfSet;

            return db.exec(sql, Object.values(sqlDatas));
        })
        .then(resultCreate => {
            return db.findOne("SELECT * FROM menu_items WHERE meit_id=? LIMIT 1", [resultCreate.insertId])
        })
        .then(resultFind => {
            return response.json({status:true, item: resultFind})
        })
        .catch(error => {
            return response.json({status:false, item:{}, ...error});
        })

});



/**
 * WORK:    UPDATE MENU
 * METHOD:  PUT
 */
router.put('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id)
        return responseNotFound(response)

    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            let itemsOfSet  = ( Object.keys(sqlDatas).map( colname => colname+"=?" ) ).join(",")

            return {
                sql: `UPDATE menu_items SET ${itemsOfSet} WHERE meit_id=?`,
                datas: [...Object.values(sqlDatas), id]
            };
        })
        .then(  objForSql     => { return db.exec(objForSql.sql, objForSql.datas); })
        .then(  resultUpdate  => { return db.findOne("SELECT * FROM menu_items WHERE meit_id=? LIMIT 1", [id]) ; })
        .then(  resultFind    => { return response.json({status:true, item:resultFind}) ; })
        .catch( error         => { return response.json({status:false, ...error}); } )
});



// todo: responseNotFound return edildikten sonra yinede sonraki then çalışıyor ve hata veriyor. çöz.
// TERİM SİL
router.delete('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id){
        return responseNotFound(response)
    }
    let item = {};

    db.findOne('SELECT * FROM menu_items WHERE meit_id=? LIMIT 1', [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(resultSelect => {
            if( !Object.keys(resultSelect).length )
                return responseNotFound(response)

            item = resultSelect;
            return db.exec('DELETE FROM menu_items WHERE meit_id=?', [id])
        })
        .then(function(){
            return response.json({status:true, item:item})
        } )

});





function responseNotFound(response, message="Not Found"){
    return response.json({status:false, message})
}





module.exports = router;