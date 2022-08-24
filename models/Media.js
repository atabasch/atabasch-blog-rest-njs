let connection          = require("../database/connection");
let {Model, DataTypes, Op}  = require("sequelize");
let {slugify}           = require("../helpers");

class Media extends Model{}

Media.allowedFields = ["media_id", "media_title", "media_slug", "media_file", "media_type", "media_data", "media_c_time", "media_u_time", "media_d_time",];

Media.init({
    media_id        : {
        type:           DataTypes.INTEGER,
        allowNull:      false,
        primaryKey:     true,
        autoIncrement:  true
    },
    media_title     : {
        type: DataTypes.STRING(255),
    },
    media_slug      : {
        type: DataTypes.STRING(255),
    },
    media_file      : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    media_type      : {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    media_data      : {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        get: function(){
            return JSON.parse(this.getDataValue("media_data", {}));
        }
    },
    media_c_time    : {
        type:           DataTypes.DATE,
        defaultValue:   DataTypes.NOW
    },
    media_u_time    : {
        type:           DataTypes.DATE,
        defaultValue:   DataTypes.NOW
    },
    media_d_time    : {
        type:           DataTypes.DATE,
        defaultValue:   null
    }
}, {
    sequelize:  connection,
    tableName:  "medias",
    timestamps: true,
    createdAt:  "media_c_time",
    updatedAt:  "media_u_time",
    deletedAt:  "media_d_time",
    hooks:      {
        beforeCreate: async function(model){
            if(!model.media_title){
                model.media_title = model.media_file;
            }

            let slug = slugify(model.media_title);
            model.media_slug = slug;

            let counter = 1;
            while(true){
                counter++;
                let media = await Media.findOne({ where: { media_slug: model.media_slug } });
                if(!media){
                    break;
                }else{
                    model.media_slug = slug +"-"+ counter
                }
            }

        },

        beforeUpdate: async function(model){
            let slug = slugify(model.media_title);
            model.media_slug = slug;

            let counter = 1;
            while(true){
                counter++;
                let media = await Media.findOne({ where: { media_slug: model.media_slug, media_id: {[Op.ne]: model.media_id} } });
                if(!media){
                    break;
                }else{
                    model.media_slug = slug +"-"+ counter
                }
            }
        }
    }
});

module.exports = Media;