let connection = require("../database/connection");
let {Model, DataTypes} = require("sequelize");
let Menu = require("./Menu");

class MenuItem extends  Model{}

MenuItem.allowedFields = [
    'meit_id',
    'term_id',
    'menu_id',
    'meit_parent',
    'meit_title',
    'meit_path',
    'meit_order',
    'meit_data',
];

MenuItem.init( {
    meit_id :       {
        type:       DataTypes.INTEGER.UNSIGNED,
        allowNull:  false,
        primaryKey: true,
        autoIncrement: true
    },
    term_id :       {
        type:       DataTypes.INTEGER.UNSIGNED,
        allowNull:  true,
        defaultValue: 0
    },
    menu_id :       {
        type:       DataTypes.INTEGER.UNSIGNED,
        allowNull:  false,
    },
    meit_parent :   {
        type:       DataTypes.INTEGER.UNSIGNED,
        allowNull:  false,
        defaultValue: 0
    },
    meit_title :    {
        type:       DataTypes.STRING(255),
        allowNull:  false
    },
    meit_path :     {
        type:       DataTypes.STRING(255),
        allowNull:  true,
        defaultValue: null
    },
    meit_order :    {
        type:       DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    meit_data :     {
        type:       DataTypes.JSON,
        defaultValue: {}
    },
}, {
    sequelize: connection,
    tableName: "menu_items",
    timestamps: false
});

module.exports = MenuItem;