let connection = require("../database/connection");
let {Model, DataTypes, Op} = require("sequelize");
let {slugify} = require("../helpers")
let Term = require("./Term");

class Taxonomy extends Model{}

Taxonomy.allowedFields = [
    'tax_id',
    'tax_title',
    'tax_slug',
    'tax_description',
    'tax_status',
];

Taxonomy.init({
    tax_id:             {
        type:       DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    tax_title:          {
        type:       DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: { msg: "3 ile 60 karakter arasında bir taksonomi adı girin", args: [3, 60] }
        }
    },
    tax_slug:           {
        type:       DataTypes.STRING(255),
    },
    tax_description:    {
        type:       DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    tax_status:         {
        type:       DataTypes.STRING,
    },
},{
    sequelize: connection,
    tableName: "taxonomies",
    timestamps: false,
    hooks: {
        beforeCreate: async function(model){
            let slug = slugify(model.tax_title);
            model.tax_slug = slug;

            for(let i=2; i<=11; i++){
                let tax = await Taxonomy.findOne( { where: { tax_slug: model.tax_slug } } );
                if(!tax){ break; }else{
                    model.tax_slug = slug +"-"+ i;
                }
            }
        },

        beforeUpdate: async function(model){
            let slug = slugify(model.tax_title);
            model.tax_slug = slug;

            for(let i=2; i<=11; i++){
                let tax = await Taxonomy.findOne( { where: { tax_slug: model.tax_slug, tax_id: { [Op.ne]:model.tax_id } } } );
                if(!tax){ break; }else{
                    model.tax_slug = slug +"-"+ i;
                }
            }
        }
    }
});
Taxonomy.hasMany(Term, { sourceKey:"tax_id" ,foreignKey:"tax_id", as: "terms" })
Term.belongsTo(Taxonomy, { foreignKey:"term_id", targetKey: "tax_id", as: "taxonomy" })

module.exports = Taxonomy;