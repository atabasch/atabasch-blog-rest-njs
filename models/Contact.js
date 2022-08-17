var connect = require("../database/connection");
var {Model, DataTypes} = require("sequelize");

class Contact extends Model{}

Contact.allowedFields = ['contact_id',  'contact_title',  'contact_content',  'contact_person',  'contact_email',  'contact_status',  'contact_datas',  'contact_c_time',  'contact_u_time'];

Contact.init({

    contact_id      : {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    contact_title   : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "konu başlığı boş bırakılamaz."
            },
            notEmpty: {
                msg: "konu başlığı boş bırakılamaz."
            },
            len: {
                args: [5, 25],
                msg: "konu başlığı 5 ile 25 karakter arasında olmalıdır."
            }
        }
    },
    contact_content : {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "mesaj alanı boş bırakılamaz."
            },
            notEmpty: {
                msg: "mesaj alanı boş bırakılamaz."
            },
            len: {
                args: [100],
                msg: "açıklama satırı için en az 100 karakterlik içerik gerkeli."
            }
        }
    },
    contact_person  : {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "gönderici kısmı boş bırakılamaz"
            },
            notNull: {
                msg: "gönderici kısmı boş bırakılamaz"
            },
            not: {
                args:   /[0-9\*\.\,\!\'\?\#\$\%\&]+/i,
                msg:    "hatalı isim girildi"
            }
        }
    },
    contact_email   : {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notNull: {
                msg: "konu başlığı boş bırakılamaz."
            },
            notEmpty: {
                msg: "e-posta alanı boş bırakılamaz."
            },
            isEmail: {
                msg: "e-posta adresi geçerli değil."
            }
        }
    },
    contact_status  : {
        type: DataTypes.ENUM('none','read','answered'),
        defaultValue: "none",
        validate: {
            isIn: {
                args: [[null, 'none', 'read', 'answered']],
                msg: "hatalı veri gönderildi."
            }
        }
    },
    contact_datas   : {
        type: DataTypes.JSON,
        defaultValue: null
    },
    contact_c_time  : {
        type: DataTypes.DATE
    },
    contact_u_time  : {
        type: DataTypes.DATE
    },

}, {
    sequelize: connect,
    tableName: "contacts",
    timestamps: true,
    createdAt: "contact_c_time",
    updatedAt: "contact_u_time"
})


module.exports = Contact;