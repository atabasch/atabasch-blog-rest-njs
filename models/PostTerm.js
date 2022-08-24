let connection = require("../database/connection");
let {Model, DataType, DataTypes} = require("sequelize");
let Post = require("./Post");
let Term = require("./Term");
class PostTerm extends Model{};

PostTerm.allowedFields = [ 'pote_id',  'post_id',  'term_id']

PostTerm.init({
    pote_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Post,
            key: "post_id"
        }
    },
    term_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Term,
            key: "term_id"
        }
    },
}, {
    sequelize: connection,
    tableName: "post_term",
    timestamps: false,
})

module.exports = PostTerm;