const express   = require("express")
const router    = express.Router();
const db        = require("./../db");
const {slugify, getDataForSql}   = require("../helpers")


/**
 * +GET:     menus      => Tüm menüleri getir. (&status=publish|trash)
 * +GET:     menus/:id  => ID' numarası verilen menüyü getir.
 * -GET:     menus/:id/items  => ID' numarası verilen menünün itemlerini getir.
 * +POST:    menus      => Yeni menü oluştur.
 * +PUT:     menus/:id  => ID'si verilen menüyü güncellenecek.
 * +DELETE:  menus/:id  => ID'si verilen menüyü silinecek.
 */

var allowedFields = ["menu_title", "menu_slug ", "menu_description", "menu_status"];

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
    let sql     = `SELECT * FROM menus ORDER BY menu_id DESC`;
    db.find(sql)
        .catch(error => { return response.json({status:false, ...error}) })
        .then(result => { return response.json({status:true, menus:result}) })
});




// MENU BİLGİLERİNİ GETİR.
router.get('/:id', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response)

    let sql = `SELECT * FROM menus WHERE menu_id=? LIMIT 1`;

    db.findOne(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => { return response.json({status:true, menu:(result || {})}); })
});



// MENU BİLGİLERİNİ ve itemlerini GETİR.
router.get('/:id/items', (request, response)=>{
    let id = request.params.id || null;
    if(!id)
        return responseNotFound(response)

    let sql = `SELECT * FROM menus WHERE menu_id=? LIMIT 1`;

    let menu = {}
    db.findOne(sql, [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(result => {
            menu = result;
            return db.find("SELECT * FROM menu_items WHERE menu_id=? ORDER BY meit_order ASC", [id])
        })
        .then(resultItems => {
            let menuObj = menu || {}
            menuObj.items = resultItems || []
            return response.json({status:true, menu:menuObj} );
        });
});






// MENU OLUŞTUR
router.post('/', (request, response)=>{
    // todo: request body yerine bir obje gelsin
    getDataForSql(request.body, allowedFields)
        .then(sqlDatas => {
            sqlDatas.menu_slug = slugify(sqlDatas.menu_title);
            sqlDatas.menu_status = "publish";
            let itemsOfSet = (Object.keys(sqlDatas).map( colname => colname+"=?" )).join(',');
            let sql = "INSERT INTO menus SET " + itemsOfSet;

            return db.exec(sql, Object.values(sqlDatas));
        })
        .then(resultCreate => {
            return db.findOne("SELECT * FROM menus WHERE menu_id=? LIMIT 1", [resultCreate.insertId])
        })
        .then(resultFind => {
            return response.json({status:true, menu: resultFind})
        })
        .catch(error => {
            return response.json({status:false, menu:{}, ...error});
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
            if( sqlDatas.hasOwnProperty('menu_title') ){
                sqlDatas.menu_slug = slugify(sqlDatas.menu_title);
            }

            let itemsOfSet  = ( Object.keys(sqlDatas).map( colname => colname+"=?" ) ).join(",")

            return {
                sql: `UPDATE menus SET ${itemsOfSet} WHERE menu_id=?`,
                datas: [...Object.values(sqlDatas), id]
            };
        })
        .then(  objForSql     => { return db.exec(objForSql.sql, objForSql.datas); })
        .then(  resultUpdate  => { return db.findOne("SELECT * FROM menus WHERE menu_id=? LIMIT 1", [id]) ; })
        .then(  resultFind    => { return response.json({status:true, menu:resultFind}) ; })
        .catch( error         => { return response.json({status:false, ...error}); } )
});



// todo: responseNotFound return edildikten sonra yinede sonraki then çalışıyor ve hata veriyor. çöz.
// TERİM SİL
router.delete('/:id', (request, response)=>{
    let id = request.params.id || null
    if(!id){
        return responseNotFound(response)
    }
    let menu = {};

    db.findOne('SELECT * FROM menus WHERE menu_id=? LIMIT 1', [id])
        .catch(error => { return response.json({status:false, ...error}); })
        .then(resultSelect => {
            if( !Object.keys(resultSelect).length )
                return responseNotFound(response)

            menu = resultSelect;
            return db.exec('DELETE FROM menus WHERE menu_id=?', [id])
        })
        .then(function(){
            return response.json({status:true, menu:menu})
        } )

});





function responseNotFound(response, message="Not Found"){
    return response.json({status:false, message})
}





module.exports = router;