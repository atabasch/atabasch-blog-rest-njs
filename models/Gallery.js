let connection          = require("../database/connection")
let {Model, DataTypes}  = require("sequelize");
let {slugify}           = require("../helpers")

class Gallery extends Model{}

Gallery.allowedFields = [
    "gallery_id",
    "gallery_title",
    "gallery_slug",
    "gallery_description",
    "gallery_images",
    "gallery_cover",
    "gallery_status",
    "gallery_c_time",
    "gallery_u_time",
    "gallery_d_time",
];

Gallery.init({
    gallery_id          : {
        type:           DataTypes.INTEGER.UNSIGNED,
        primaryKey:     true,
        autoIncrement:  true
    },
    gallery_title       : {
        type:           DataTypes.STRING,
        allowNull:      false,
        validate: {
            notNull:    { msg: "2 ile 250 karakter arasında geçerli bir galeri başlığı girilmeli." },
            notEmpty:   { msg: "2 ile 250 karakter arasında geçerli bir galeri başlığı girilmeli." },
            len:        { msg: "2 ile 250 karakter arasında geçerli bir galeri başlığı girilmeli.", args: [2, 250] }
        }
    },
    gallery_slug        : {
        type:           DataTypes.STRING,
        unique:         true,
    },
    gallery_description : {
        type:           DataTypes.STRING,
        allowNull:      true,
        defaultValue:   null,
        validate:       {
            len:        { msg: "galeri başlığı en fazla 255 karakter olmalıdır.", args: [0, 255] }
        }
    },
    gallery_images      : {
        type:           DataTypes.JSON,
        defaultValue:   JSON.stringify([]),
    },
    gallery_cover       : {
        type:           DataTypes.STRING,
        defaultValue:   null,
    },
    gallery_status      : {
        type:           DataTypes.ENUM("none", "publish", "draft"),
        defaultValue:   "none",
        validate:       {
            isIn:       { msg: "geçerli bir durum değeri girilmedi." , args: [["none", "publish", "draft"]] }
        }
    },
    gallery_c_time      : {
        type:           DataTypes.DATE
    },
    gallery_u_time      : {
        type:           DataTypes.DATE
    },
    gallery_d_time      : {
        type: DataTypes.DATE,
        allowNull:      true,
        defaultValue:   null
    },
}, {
    sequelize:  connection,
    tableName:  "galleries",
    timestamps: true,
    createdAt:  "gallery_c_time",
    updatedAt:  "gallery_u_time",
    deletedAt:  "gallery_d_time",
    hooks:      {
            beforeCreate: async function(model){
                let slug = slugify(model.gallery_title);
                model.gallery_slug = slug

                let counter = 1;
                while(true){
                    counter++;
                    let item = await Gallery.findOne({
                        where: {
                            gallery_slug: model.gallery_slug
                        }
                    });
                    if(item){
                        model.gallery_slug = slug + "-" + counter
                    }else{
                        break;
                    }
                } // while

            }
    }
});

module.exports = Gallery;