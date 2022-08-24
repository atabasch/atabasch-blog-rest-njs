const connection = require("../database/connection");
const {Model, DataTypes, Op} = require("sequelize");
const {slugify} = require("../helpers");
const MenuItem = require("./MenuItem");

class Menu extends Model{}

Menu.allowedFields = [ "menu_id",  "menu_title",  "menu_slug",  "menu_description",  "menu_status"];

Menu.init({
    menu_id :           {
        type:  DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    menu_title :        {
        type:  DataTypes.STRING(60),
        allowNull: false,
        validate: {
            isNull:     { msg: "Menu başlığı boş bırakılamaz" },
            isEmpty:    { msg: "Menü başlığı boş bırakılamaz" },
            len:        { msg: "3 ile 60 karakter arasında bir menü başlığı girilmeli", args: [3, 60] }
        }
    },
    menu_slug :         {
        type:  DataTypes.STRING(60),
        allowNull: true
    },
    menu_description :  {
        type:  DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    menu_status :       {
        type:  DataTypes.ENUM("none", "publish"),
        defaultValue: "publish"
    },
},{
    sequelize: connection,
    tableName: "menus",
    timestamps: false,
    hooks: {
        beforeCreate: async function(model){
            let slug = await slugify(model.menu_title);
            model.menu_slug = slug;

            for(let i=1; i<=99; i++){
                let menu = await Menu.findOne({ where: { menu_slug: model.menu_slug } });
                if(!menu){ break; }else{
                    model.menu_slug = slug + "-" + i;
                }
            }
        },

        beforeUpdate: async function(model){
            let slug = await slugify(model.menu_title);
            model.menu_slug = slug;

            for(let i=1; i<=99; i++){
                let menu = await Menu.findOne({ where: { menu_slug: model.menu_slug, menu_id: { [Op.ne]: model.menu_id } } });
                if(!menu){ break; }else{
                    model.menu_slug = slug + "-" + i;
                }
            }
        }
    }
});

//
Menu.hasMany(MenuItem, { as:"items", sourceKey:"menu_id", foreignKey:"menu_id" });
MenuItem.belongsTo(Menu, { as:"menu", foreignKey:"menu_id", targetKey:"menu_id" });

module.exports = Menu;