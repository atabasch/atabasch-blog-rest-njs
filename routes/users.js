var express = require('express');
var router = express.Router();
var db      = require("./../db");

let allowedFields = {
    id:             "users.user_id",
    name:           "users.user_name",
   // password:       "users.user_password",
    email:          "users.user_email",
    displayname:    "users.user_displayname",
    image:          "users.user_image",
    level:          "users.user_level",
    firstname:      "users_data.user_firstname",
    lastname:       "users_data.user_lastname",
    birthdate:      "users_data.user_birthdate",
    gender:         "users_data.user_gender",
    langcode:       "users_data.user_langcode",
    timezone:       "users_data.user_timezone",
    c_time:         "users.user_c_time",
    u_time:         "users.user_u_time",
    d_time:         "users.user_d_time",
    l_time:         "users.user_l_time",
}



let sql = {
    select: "SELECT $SELECT FROM users LEFT JOIN users_data ON users_data.user_id=users.user_id",
    insert: "INSERT INTO $TABLE SET ?",
    update: "UPDATE $TABLE SET ?? WHERE user_id=?",
    delete: "DELETE FROM $TABLE WHERE user_id=?",
    softDelete: "UPDATE $TABLE SET user_d_time=NOW() WHERE user_id=?"
}

const filterQueryFields = (fields) => {
    return new Promise(function(success){

        let selectedArray = [];
        if(fields == null){
            success( Object.values(allowedFields).join(",") );
        }else{
            let fieldsArray = fields.split(",");
            fieldsArray.map((val, key) => {

                if(typeof allowedFields[val] != "undefined"){
                    selectedArray.push( allowedFields[val] )
                }

                if(key == fieldsArray.length-1){
                    success(selectedArray.join(","));
                }

            });
        }

    });
}

/**
 * method:  get
 * path:    /user
 * desc:    Kullanıcıları getirir.
 */
router.get('/', function(request, response, next) {
    let fields = request.query.fields || null;
    filterQueryFields(fields).then(selectedString => {
        let querySql = sql.select.replace("$SELECT", selectedString);
        db.find(querySql)
            .catch(err=>{
                response.json({status:false, error:err});
            })
            .then((results, fields) => {
                response.json({status:true, users: results});
            })
    });
});



/**
 * method:  get
 * path:    /user/id
 * desc:    Tek kullanıcı verisi getirir.
 */
router.get('/:id', function(request, response, next) {
    let fields  = request.query.fields || null;
    let id      = request.params.id || null
    if(!id)
        return response.status(400).json({status:false});


    filterQueryFields(fields).then(selectedString => {
        let querySql = sql.select.replace("$SELECT", selectedString) + " WHERE users.user_id=? LIMIT 1";
        db.find(querySql, [id])
            .catch(err=>{
                response.json({status:false, error:err});
            })
            .then((results, fields) => {
                response.json({status:true, user: results});
            })
    });
});



/**
 * method:  post
 * path:    /user
 * desc:    Yeni kullanıcı oluşturur.
 */
router.post('/', (request, response) => {
    let datasForUsers = {
        user_name:      request.body.user_name || null,
        user_password:  request.body.user_password || null,
        user_email:     request.body.user_email || null,
        user_displayname:     request.body.user_displayname || this.user_name,
        user_image:     request.body.user_image || null,
        user_level:     request.body.user_level || "active",
    }
    let datasForUsersData = {
        user_id:        null,
        user_firstname: request.body.user_firstname || datasForUsers.user_name,
        user_lastname:  request.body.user_lastname || null,
        user_birthdate: request.body.user_birthdate || null,
        user_gender:    request.body.user_gender || "none",
        user_langcode:  request.body.user_langcode || "tr",
        user_timezone:  request.body.user_timezone || "Europa/Istanbul",
    }

    db.exec(sql.insert.replace("$TABLE", "users"), datasForUsers)
    .catch(error => {
        return response.status(400).json({error})
    })
    .then( (result) => {

        datasForUsersData.user_id = result.insertId;
        db.exec(sql.insert.replace("$TABLE", "users_data"), datasForUsersData)
            .catch(error => {
                return response.status(400).json({error})
            })
            .then( () => {
                return response.status(200).json({...result})
            } )

    } );

});


/**
 * method:  put
 * path:    /user/id
 * desc:    Kullanıcı bilgilerini günceller
 */
router.put('/:id', (request, response) => {
    let userId = request.params.id || null;
    if(!userId)
        return response.status(400).json({status:false});

    let findSql = sql.select.replace("$SELECT", "*") + " WHERE users.user_id=? LIMIT 1";
    db.find(findSql, [userId])
        .catch(error => {
            return response.status(400).json({status:false, ...error});
        })
        .then(result => {
            let user = result[0];

            let data = request.body || {}

            let datasForUsers = {
                user_name:      data.user_name || user.user_name,
                user_password:  data.user_password || user.user_password,
                user_displayname:  data.user_displayname || user.user_displayname,
                user_email:     data.user_email || user.user_email,
                user_image:     data.user_image || user.user_image,
                user_level:     data.user_level || user.user_level,
            }
            let datasForUsersData = {
                user_firstname: data.user_firstname ||  user.user_firstname,
                user_lastname:  data.user_lastname ||   user.user_lastname,
                user_birthdate: data.user_birthdate ||  user.user_birthdate,
                user_gender:    data.user_gender ||     user.user_gender,
                user_langcode:  data.user_langcode ||   user.user_langcode,
                user_timezone:  data.user_timezone ||   user.user_timezone,
            }

            let setItems = Object.keys(datasForUsers).map( function(keyname){
                return keyname+" = ?";
            } );
            let sqlUpdateForUsers = `UPDATE users SET ${setItems.join(",")} WHERE user_id=?`;

            db.exec(sqlUpdateForUsers, [...Object.values(datasForUsers), userId])
                .catch(error => {
                    return response.status(400).json({status:false, ...error});
                })
                .then(result => {

                    setItems = Object.keys(datasForUsersData).map( function(keyname){
                        return keyname+" = ?";
                    } );
                    let sqlUpdateForUsersData = `UPDATE users_data SET ${setItems.join(",")} WHERE user_id=?`;
                    db.exec(sqlUpdateForUsersData, [...Object.values(datasForUsersData), userId])
                        .catch(error => {
                            return response.status(400).json({status:false, ...error});
                        })
                        .then(() => {

                            return response.status(200).json({status:true, ...result});


                        })

                })


        });

})


/**
 * method:  delete
 * path:    /user/id/soft
 * desc:    Kullanıcı kaydının user_d_time hücresini doldurur.
 */
router.delete('/:id/soft', (request, response)=>{

    let user_id = request.params.id || false;
    if(!user_id){
        response.json({status:false})
    }else{
        db.exec(sql.softDelete.replace("$TABLE", "users"), [user_id])
            .catch(error => response.json({error}))
            .then(result => response.json({status:true, ...result}))
    }

});


/**
 * method:  delete
 * path:    /user/id
 * desc:    Kullanıcı kaydını siler
 */
router.delete('/:id', (request, response)=>{

    let user_id = request.params.id || false;
    if(!user_id){
        response.json({status:false})
    }else{
        db.exec(sql.delete.replace("$TABLE", "users"), [user_id])
            .catch(error => response.json({error}))
            .then(result => response.json({status:true, ...result}))
    }

});







module.exports = router;
