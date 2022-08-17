var connection  = require("../database/connection");
var {Model, DataTypes} = require("sequelize");

class Comment extends Model{}

Comment.allowedField = ["post_id",  "user_id",  "comment_content",  "comment_email",  "comment_person",  "comment_status",  "comment_c_time",  "comment_u_time",  "comment_d_time",  "comment_p_time",  "comment_id"]


Comment.init({
    comment_id:         {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id         : {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull:{
                msg: "içerik kimliği boş bırakılamaz."
            },
            notEmpty: {
                msg: "içerik kimliği boş bırakılamaz."
            },

        }
    },
    user_id         : {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    comment_content : {
        type: DataTypes.STRING,
    },
    comment_email   : {
        type: DataTypes.STRING,
    },
    comment_person  : {
        type: DataTypes.STRING,
    },
    comment_status  : {
        type: DataTypes.STRING,
    },
    comment_c_time  : {
        type: DataTypes.STRING,
    },
    comment_u_time  : {
        type: DataTypes.STRING,
    },
    comment_d_time  : {
        type: DataTypes.STRING,
    },
    comment_p_time  : {
        type: DataTypes.STRING,
    },
    comment_id      : {
        type: DataTypes.STRING,
    },

},{
    sequelize: connection,
    tableName: "comments",
    timestamps: true,
    createdAt: "comment_c_time",
    updatedAt: "comment_u_time",
    deletedAt: "comment_d_time"
})


module.exports = Comment;