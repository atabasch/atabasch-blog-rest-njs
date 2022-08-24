let connection = require("../database/connection");
let {Model, DataTypes, Op} = require("sequelize");
let {slugify} = require("../helpers")
// let Taxonomy = require("./Taxonomy");

class Term extends Model{}

Term.allowedFields = [
    "term_id",
    "tax_id",
    "term_title",
    "term_slug",
    "term_description",
    "term_parent",
    "term_order",
];

Term.init({
    term_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    tax_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    term_title: {
        type: DataTypes.STRING(255),
        validate: {
            isNull: { msg: "Terim adı boş bırakılamaz." },
            isEmpty: { msg: "Terim adı boş bırakılamaz." },
            len: { msg: "3 ile 60 karakter arasında bir terim başlığı girilmeli.", args: [3, 60] }
        }
    },
    term_slug: {
        type: DataTypes.STRING(255)
    },
    term_description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    term_parent: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    term_order: {
        type: DataTypes.TINYINT.UNSIGNED,
        defaultValue: 0
    },
},{
    sequelize: connection,
    tableName: "terms",
    timestamps: false,
    hooks: {
        beforeCreate: async function(model){
            let slug = slugify(model.term_title);
            model.term_slug = slug;

            for(let i=2; i<=11; i++){
                let term = await Term.findOne( { where: { term_slug: model.term_slug } } );
                if(!term){ break; }else{
                    model.term_slug = slug +"-"+ i;
                }
            }
        },

        beforeUpdate: async function(model){
            let slug = slugify(model.term_title);
            model.term_slug = slug;

            for(let i=2; i<=11; i++){
                let term = await Term.findOne( { where: { term_slug: model.term_slug, term_id: { [Op.ne]:model.term_id } } } );
                if(!term){ break; }else{
                    model.term_slug = slug +"-"+ i;
                }
            }
        }
    }
});
// Term.belongsTo(Taxonomy, { sourceKey:"term_id", foreignKey:"tax_id", as: "taxonomy" });


module.exports = Term;