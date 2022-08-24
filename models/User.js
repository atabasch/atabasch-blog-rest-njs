let connection = require("../database/connection");
let {Model, DataTypes, Op} = require("sequelize");
let UserData = require("./UserData")
// let Post    = require("./Post")
let Comment = require("./Comment");
let crypto = require("crypto");

class User extends Model{}
User.init( {
    user_id :           {
        type:       DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_name :         {
        type:       DataTypes.STRING(16),
        allowNull:  false,
        unique:     {
            args:   true,
            msg:    "kullanıcı adı sistemde kayıtlı."
        },
        validate:   {
            notNull: { msg: "kullanıcı adı boş bırakılamaz" },
            notEmpty:{ msg: "kullanıcı adı boş bırakılamaz" },
            len:    { msg: "kullanıcı adı 3 ila 16 karqakter arasında olmalı.", args: [3, 16] }
        }
    },
    user_password :     {
        type:       DataTypes.STRING(25),
        allowNull:  false,
        validate:   {
            is:         { msg: "şifre 6 ila 25 karakter arasında, en az 1'er büyük harf, küçük harf, sayı ve özel karakter'e sahip olmalı.", args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,25}$/i },
            notNull:    { msg: "şifre boş bırakılamaz" },
            notEmpty:   { msg: "şifre boş bırakılamaz" },
            len:        { msg: "şifre 6 ile 25 karakter arasında olmalı" }
        }
    },
    user_email :        {
        type:       DataTypes.STRING(60),
        allowNull:  false,
        unique:     {
            args:   true,
            msg:    "e-posta adresi sistemde kayıtlı."
        },
        validate:   {
            isEmail:    { msg: "e-posta adresi geçersiz." },
            notNull:    { msg: "e-posta adresi boş bırakılamaz" },
            notEmpty:   { msg: "e-posta adresi boş bırakılamaz" },
        }
    },
    user_displayname :  {
        type:       DataTypes.STRING(60),
        allowNull:  true,
        defaultValue: ""
    },
    user_image :        {
        type:       DataTypes.STRING(255),
        allowNull:  true,
        defaultValue: null
    },
    user_status :        {
        type:       DataTypes.ENUM('none', 'banned', 'active', 'editor', 'admin'),
        defaultValue: 'none',
    },
    user_c_time :       {
        type:       DataTypes.DATE,
    },
    user_u_time :       {
        type:       DataTypes.DATE,
    },
    user_d_time :       {
        type:       DataTypes.DATE,
    },
    user_l_time :       {
        type:       DataTypes.DATE,
    },
},{
    sequelize: connection,
    tableName: "users",
    timestamps: true,
    createdAt: "user_c_time",
    updatedAt: "user_u_time",
    deletedAt: "user_d_time",
    hooks:      {
        beforeCreate: async function(m){
            if(m.user_displayname.length < 1){
                m.user_displayname = m.user_name;
            }
            m.user_password = crypto.createHmac("sha256", process.env.SECRET_KEY_PASS).update(m.user_password).digest("hex");
        },

        beforeUpdate: async function(m){

        }
    },
});

User.allowedFields = [
    "user_id",
    "user_name",
    "user_password",
    "user_email",
    "user_displayname",
    "user_image",
    "user_status",
    "user_c_time",
    "user_u_time",
    "user_d_time",
    "user_l_time",
];


User.hasOne(UserData, {  sourceKey:"user_id", foreignKey: "user_id", as: "user_data" })
UserData.belongsTo(User, {  sourceKey:"user_id", foreignKey: "user_id" });
User.hasMany(Comment, { as:"comments", sourceKey:"user_id", foreignKey:"user_id" });
Comment.belongsTo(User, { as:"user", foreignKey:"user_id", targetKey:"user_id" })

module.exports = User;