var connection  = require("../database/connection");
var {Model, DataTypes} = require("sequelize");
const User = require("./User");


class Comment extends Model{}
Comment.allowedFields = ["post_id",  "user_id",  "comment_content",  "comment_email",  "comment_person",  "comment_status",  "comment_c_time",  "comment_u_time",  "comment_d_time",  "comment_p_time",  "comment_id"]
Comment.init({
    comment_id:         {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id         : {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
            notNull:{
                msg: "içerik kimliği boş bırakılamaz."
            },
            notEmpty: {
                msg: "içerik kimliği boş bırakılamaz."
            }
        }
    },
    user_id         : {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null
    },
    comment_content : {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull:{
                msg: "yorum içeriği girilmemiş."
            },
            notEmpty: {
                msg: "yorum içeriği girilmemiş."
            },
        }
    },
    comment_email   : {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        validate: {
            isEmail: {
                msg: "gereçli bir e-posta adresi girilmedi."
            }
        }
    },
    comment_person  : {
        type: DataTypes.STRING(25),
        allowNull: true,
        validate: {
            notEmpty: {
                msg: "kişi adı alanı boş bırakılamaz"
            }
        }
    },
    comment_status  : {
        type: DataTypes.ENUM("none", "publish", "trash"),
        defaultValue: "none",
        validate: {
            isIn: {
                args: [["none", "publish", "trash"]],
                msg: "geçerli bir durum değeri girilmedi."
            }
        }
    },
    comment_c_time  : {
        type: DataTypes.DATE,
        allowNull: false
    },
    comment_u_time  : {
        type: DataTypes.DATE,
        allowNull: false
    },
    comment_d_time  : {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    comment_p_time  : {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }

},{
    sequelize: connection,
    tableName: "comments",
    timestamps: true,
    createdAt: "comment_c_time",
    updatedAt: "comment_u_time",
    deletedAt: "comment_d_time"
})



module.exports = Comment;