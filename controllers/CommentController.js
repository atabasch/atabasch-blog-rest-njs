const Comment = require("../models/Comment");
let {getSelectedColumnsForSql} = require("../helpers");
const Contact = require("../models/Contact");

module.exports = {

    GetAll: (request, response) => {
        Comment.findAll({
            attributes: getSelectedColumnsForSql(request, Comment.allowedFields),
            limit:      parseInt(request.query.limit) || null,
            offset:     parseInt(request.query.offset) || null,
            order:      request.query.order? [request.query.order.split(",").slice(0,2)] : null,
            include:    ["user"]
        })
            .catch(function(error){
                return response.status(400).json({status:false, ...error});
            })
            .then(function(results){
                return response.status(200).json({status:true, comments:results});
            })
    },

    GetOne: function(request, response){
        Comment.findOne({
            attributes: getSelectedColumnsForSql(request, Comment.allowedFields),
            where: {
                comment_id: request.params.id || 0
            }
        })
            .catch(function(error){
                return response.status(400).json({status:false, ...error});
            })
            .then(function(comment){
                return response.status(200).json({status:true, comment:comment});
            })
    },

    Create:  function(request, response){
        let postDatas = request.body
        Comment.create(postDatas)
            .then(comment   => response.json({ status:true, comment:comment }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            });
    },

    Update: function(request, response){
        let postDatas = request.body
        Comment.findByPk(request.params.id || 0 )
            .then(comment   => comment.update(postDatas) )
            .then(comment   => response.json({ status:true, comment:comment }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            })
    },

    Delete: function(request, response){
        Comment.findByPk(request.params.id | 0)
            .then(comment   => comment.destroy())
            .then(comment   => response.json({ status:true, contact:comment }))
            .catch(error    => response.json({ status:false, error}));
    }

}