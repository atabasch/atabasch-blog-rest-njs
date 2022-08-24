let connection = require("../database/connection");
let {Model, DataTypes, Op} = require("sequelize");
const {slugify} = require("../helpers");
const Term = require("./Term");
const User = require("./User");
const Comment = require("./Comment");
const PostTerm = require("./PostTerm");

class Post extends Model{}

Post.allowedFields = [
    'post_id',
    'post_title',
    'post_slug',
    'post_descritpion',
    'post_content',
    'post_cover',
    'user_id',
    'post_status',
    'post_type',
    'post_parent',
    'post_c_time',
    'post_u_time',
    'post_d_time',
];

Post.init({
    post_id :           {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    post_title :        {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: { msg: "3 ila 255 karakter arasında bir konu başlığı girilmeli" }
        }
    },
    post_slug :         {
        type: DataTypes.STRING(255),
        defaultValue: null
    },
    post_description :  {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    post_content :      {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ""
    },
    post_cover :        {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    user_id :           {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    post_status :       {
        type: DataTypes.ENUM('publish', 'draft', 'trash'),
        defaultValue: 'draft',
    },
    post_type :         {
        type: DataTypes.STRING(10),
        defaultValue: 'post'
    },
    post_parent :       {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    post_c_time :       {
        type: DataTypes.DATE
    },
    post_u_time :       {
        type: DataTypes.DATE
    },
    post_d_time :       {
        type: DataTypes.DATE
    },
},{
    sequelize: connection,
    tableName: "posts",
    timestamps: true,
    createdAt: "post_c_time",
    updatedAt: "post_u_time",
    deletedAt: "post_d_time",
    hooks:      {
        beforeCreate: async function(m){
            let slug = slugify(m.post_title);
            m.post_slug = slug;

            for(let i=2; i<=11; i++){
                let post = await Post.findOne({ where: { post_slug: m.post_slug } });
                if(!post){ break; }else{ m.post_slug = slug+"-"+i }
            }
        },
        beforeUpdate: async function(m){
            let slug = slugify(m.post_title);
            m.post_slug = slug;

            for(let i=2; i<=11; i++){
                let post = await Post.findOne({ where: { post_slug: m.post_slug, post_id: { [Op.ne]: m.post_id } } });
                if(!post){ break; }else{ m.post_slug = slug+"-"+i }
            }
        }
    }
});

Post.hasOne(User, { as:"user", sourceKey:"user_id", foreignKey:"user_id" });
Post.hasMany(Comment, { as:"comments", sourceKey:"post_id", foreignKey:"post_id" });
Post.belongsToMany(Term, { as:"terms", foreignKey:"post_id", uniqueKey:false, through: PostTerm})
Term.belongsToMany(Post, { as:"posts", foreignKey:"term_id", uniqueKey:false, through: PostTerm})


module.exports = Post;