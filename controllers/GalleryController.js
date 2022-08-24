let Gallery = require("../models/Gallery");
let {getSelectedColumnsForSql} = require("../helpers");

module.exports = {

    GetAll: function(request, response){
        Gallery.findAndCountAll({
            attributes: getSelectedColumnsForSql(request, Gallery.allowedFields)
        })
            .then(galleries => response.json( { status:true, count:galleries.count || 0, galleries:galleries.rows || [] } ))
            .catch(error    => response.json({ status:false, error:error }))
    },


    GetOne: function (request, response){
        Gallery.findOne({
            attributes: getSelectedColumnsForSql(request, Gallery.allowedFields),
            where: {
                gallery_id: request.params.id || 0
            }
        })
            .then(gallery   => response.json({ status:true, gallery:gallery }))
            .catch(error    => response.json({ status:false, error:error }) );
    },


    Create: function(request, response){
        let postDatas = request.body
        Gallery.create(postDatas)
            .then(gallery   => response.json({ status:true, gallery:gallery }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            });
    },


    Update: function(request, response){
        let postDatas = request.body
        Gallery.findByPk(request.params.id || 0 )
            .then(gallery   => gallery.update(postDatas) )
            .then(gallery   => response.json({ status:true, gallery:gallery }))
            .catch(error    => {
                let errors = error.errors.map(obj => { return {message:obj["message"], value:obj["value"]}  });
                return response.json({ status:false, error:errors });
            })
    },

    UploadImage: function (){
        // todo: resiim yükleme işlemi yap.
    },

    Delete: async function(request, response){
        Gallery.findByPk(request.params.id | 0)
            .then(gallery   => gallery.destroy())
            .then(result    => response.json({ status:true, gallery:result }))
            .catch(error    => response.json({ status:false, error}));
    }

}