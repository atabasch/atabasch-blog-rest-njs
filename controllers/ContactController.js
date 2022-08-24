let Contact = require("../models/Contact")
let {request, response} = require("express")
const Gallery = require("../models/Gallery");

module.exports = {

    GetAll: function(request, response){
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
    },

    GetOne: function(request, response){
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
    },

    Create:  function(request, response){
        let postDatas = request.body
        Contact.create(postDatas)
            .then(contact   => response.json({ status:true, contact:contact }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            });
    },

    Update: function(request, response){
        let postDatas = request.body
        Contact.findByPk(request.params.id || 0 )
            .then(contact   => contact.update(postDatas) )
            .then(contact   => response.json({ status:true, contact:contact }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            })
    },

    Delete: function(request, response){
        Contact.findByPk(request.params.id | 0)
            .then(contact   => contact.destroy())
            .then(result    => response.json({ status:true, contact:result }))
            .catch(error    => response.json({ status:false, error}));
    }

}