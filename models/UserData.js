let connection = require("../database/connection");
let {DataTypes, Model} = require("sequelize");

class UserData extends Model{}
UserData.init({
    user_id : {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    user_firstname : {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: null
    },
    user_lastname : {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: null
    },
    user_birthdate : {
        type: DataTypes.DATE,
    },
    user_gender : {
        type: DataTypes.ENUM('none', 'male', 'female'),
        defaultValue: 'none'
    },
    user_langcode : {
        type: DataTypes.STRING(4),
        defaultValue: "tr"
    },
    user_timezone : {
        type: DataTypes.STRING(50),
        defaultValue: "Europe/Istanbul"
    },
},{
    sequelize: connection,
    tableName: "users_data",
    timestamps: false
});

UserData.allowedFields = [
    "user_id",
    "user_firstname",
    "user_lastname",
    "user_birthdate",
    "user_gender",
    "user_langcode",
    "user_timezone",
];

module.exports = UserData;