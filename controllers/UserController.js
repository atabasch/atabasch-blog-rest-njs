let User = require("../models/User");
let {getSelectedColumnsForSql}  = require("../helpers");

module.exports = {

    GetAll: function (request, response){
        User.findAll({
            attributes: getSelectedColumnsForSql(request, User.allowedFields),
            order:      !request.query.order? null : [request.query.order.split(",").slice(0,2)],
            offset:     parseInt(request.query.offset) || null,
            limit:      parseInt(request.query.limit) || null,
            include: ["user_data", "comments"]
        })
            .then(users => {
                return response.status(200).json({ status:true, users:users });
            })
            .catch(error => {
                return response.status(400).json({ status:false, users:[], error:error });
            })
    },

    GetOne: function (request, response){

    },

    Create: function (request, response){
        let postDatas = request.body;
        User.create(postDatas)
            .then(user => {
                return response.status(200).json({ status:true, user:user });
            })
            .catch(error => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.status(400).json({ status:false, errors:errors });
            })
    },

    Update: function (request, response){

    },

    Delete: function (request, response){

    },


}