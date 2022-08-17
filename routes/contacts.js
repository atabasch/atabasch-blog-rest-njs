var express = require("express")
var router  = express.Router();
var Contact = require("../models/Contact")


/**
 * EXAMPLE: /contacts?fields=contact_id,contact_title,contact_person,contact_status&limit=4&offset=0&order=contact_id,desc
 * WORK:    LIST ALL
 * METHOD:  GET
 * PATH:    /contacts
 *
 */
router.get("/", function(request, response){
    let selectedFields  = request.query.fields || null
    if(selectedFields){
        selectedFields = selectedFields.split(",").filter(colName => Contact.allowedFields.indexOf(colName)>-1 )
    }

    Contact.findAndCountAll({
        attributes: selectedFields || false,
        limit:      parseInt(request.query.limit) || null,
        offset:     parseInt(request.query.offset) || null,
        order:      request.query.order? [request.query.order.split(",").slice(0,2)] : null,
    })
        .catch(error => response.status(400).json({status:false, ...error}))
        .then(function(contacts){
            return response.status(200).json({status:true, count:contacts.count, contacts:contacts.rows})
        })
});



/**
 * EXAMPLE: /contacts?fields=contact_id,contact_title,contact_person,contact_status
 * WORK:    FIND ONE
 * METHOD:  GET
 * PATH:    /contacts/:id
 *
 */
router.get("/:id", function(request, response){
    let selectedFields  = request.query.fields || null
    if(selectedFields){
        selectedFields = selectedFields.split(",").filter(colName => Contact.allowedFields.indexOf(colName)>-1 )
    }

    Contact.findOne({
        where: {contact_id:request.params.id},
        attributes: selectedFields || false,
    })
        .catch(error => response.status(400).json({status:false, ...error}))
        .then(function(contact){
            return response.status(200).json({status:true, contact})
        })
});


/**
 * WORK:    CREATE
 * METHOD:  POST
 * PATH:    /contacts
 *
 */
router.post("/", function(request, response){
    let postDatas = request.body;
    Contact.create(postDatas)
        .then(contact => {
            return response.status(200).json({status:true, contact});
        })
        .catch(function(error){
            let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
            return response.status(400).json({status:false, errors:errors})
        })
});



/**
 * WORK:    UPDATE
 * METHOD:  PUT
 * PATH:    /contacts/id
 *
 */
router.put("/:id", function(request, response){
    let postDatas = request.body;
    Contact.upsert(postDatas, {
        where: {contact_id: request.params.id}
    })
        .then(contact => {
            return response.status(200).json({status:contact[1], contact:contact[0]});
        })
        .catch(function(error){
            let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
            return response.status(400).json({status:false, errors:errors})
        })
});





/**
 * WORK:    DELETE
 * METHOD:  DELETE
 * PATH:    /contacts/id
 *
 */
router.delete("/:id", function(request, response){
    let postDatas = request.body;
    Contact.destroy({
        where: {contact_id: request.params.id}
    })
        .then(result => {
            return response.status(200).json({status:true, result: result});
        })
        .catch(function(error){
            let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
            return response.status(400).json({status:false, errors:errors})
        })
});




module.exports = router;