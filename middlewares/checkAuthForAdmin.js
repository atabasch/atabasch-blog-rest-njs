var {verify}    = require("jsonwebtoken")
var secretKey   = process.env.SECRET_KEY

module.exports = function(request, response, next){
    next();
    return;
    //todo: gerçek bir giriş kontrolü yaptır.
    let token = request.headers["x-access-token"] || null
    if(!token){
        return response.status(403).json({status:false});
    }else{
        verify(token, secretKey, function(error, data){
            if(error){
                return response.status(403).json({status:false, ...error});
            }else{
                if(!data.admin){
                    return response.status(403).json({status:false});
                }else{
                    next();
                }
            }
        });
    }

}