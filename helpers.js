
var slugify = require("slugify");
const Contact = require("./models/Contact");
module.exports.slugify = function (str){
    return slugify(str, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'tr',       // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
}




module.exports.getDataForSql = function (datas, allowedDatas){
    return new Promise(function(success){

        let lengthDatas     = Object.keys(datas).length-2;
        let resultDatas     = {}

        Object.entries(datas).forEach( ([key, val], index) => {
            if(allowedDatas.indexOf(key) > -1){
                resultDatas[key] = val;
            }

            if(index > lengthDatas){
                return success(resultDatas)
            }

        } );
    });
}



module.exports.getSelectedColumnsForSql = function(request, allowedFields){
    let selectedFields  = request.query.fields || null
    if(selectedFields){
        selectedFields = selectedFields.split(",").filter(colName => allowedFields.indexOf(colName)>-1 )
    }
    return (selectedFields || false)
}


module.exports.isAdmin = function(){
    return true;
}