let Media   = require("../models/Media");
let {getSelectedColumnsForSql} = require("../helpers");
let {Op}    = require("sequelize");
let path    = require("path");
let fs      = require("fs");

module.exports = {

    GetAll: function(request, response){
        Media.findAndCountAll({
            attributes: getSelectedColumnsForSql(request, Media.allowedFields),
            limit:  parseInt(request.query.limit) || null,
            offset: parseInt(request.query.offset) || null,
            order:  request.query.order? [request.query.order.split(",").slice(0,2)] : null,
            where: {
               media_type: !request.query.type? false : { [Op.in]:  request.query.type.split(",") }
            }
        })
            .then(medias    => response.json( { status:true, count:medias.count || 0, medias:medias.rows || [] } ))
            .catch(error    => response.json({ status:false, error:error }))
    },


    GetOne: function (request, response){
        Media.findOne({
            attributes: getSelectedColumnsForSql(request, Media.allowedFields),
            where: {
                media_id: request.params.id || 0
            }
        })
            .then(media     => {
                // media.media_data = JSON.parse(media.media_data);
                return response.json({ status:true, media:media });
            })
            .catch(error    => response.json({ status:false, error:error }) );
    },


    Create: function(request, response){
        let postDatas = request.body
        if(!request.file){
            return response.status(400).json({status:false, message: "dosya seçilmedi"});
        }

        postDatas.media_file = request.file.filename;
        postDatas.media_type = request.file.mimetype;
        postDatas.media_data = {
            encoding:   request.file.encoding,
            size:       request.file.size
        }

        Media.create(postDatas)
            .then(media     => response.json({ status:true, media:media }))
            .catch(error    => {
                let errors = error
                if(typeof error.errors == "object"){
                    errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                }
                return response.json({ status:false, error:errors });
            });
    },


    Update: function(request, response){
        let postDatas = request.body
        Media.findByPk(request.params.id || 0 )
            .then(media   => { return media.update(postDatas) } )
            .then(media => { return response.json({ status:true, media:media }) })
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            })
    },

    Delete: async function(request, response){
        Media.findByPk(request.params.id | 0)
            .then(media   => media.destroy())
            .then(media    => {
                let filepath = path.join(__dirname, "..", process.env.PATH_UPLOADS_MEDIA, media.media_file);
                fs.unlink(filepath, function (err){
                    if(err){
                        return response.json({ status:false, media:media, error:err });
                    }else{
                        return response.json({ status:true, media:media });
                    }
                })
            })
            .catch(error    => response.json({ status:false, error}));
    },
    


}