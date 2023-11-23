const jwt = require("jsonwebtoken");
let crypto = require("crypto");
let User = require("../models/User");

let userData = {
    id:        1,
    username: "atabas61",
    password: "atabas61"
}

module.exports = {

    Index: function(request ,response){
        return response.json({status:true, title:"Atabasch Blog"})
    },

    Login: function(request, response){
        let postData = request.body.user;
        User.Login(postData)
            .then(user => {
                let sessionPayload = {
                    userId:     user.user_id,
                    userName:   user.user_name,
                    userEmail:  user.user_email,
                    admin:      user.user_status==="admin",
                }
                let tokenPayload = { ...sessionPayload,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 30} //(60 * 60) // 1. saatlik token

                jwt.sign(sessionPayload, process.env.SECRET_KEY, { algorithm: 'HS512' }, function(err, token){
                    if(err){
                        return response.status(400).json({status:false, message:"error", error:err})
                    }else{
                        sessionPayload.token = token;
                        request.session.user = sessionPayload;
                        return response.status(200).json({status:true, data:request.session.user})
                    }
                })
            })
            .catch(error => {
                console.log(crypto.createHmac("sha256", process.env.SECRET_KEY).update(postData.password).digest("hex"))
                return response.status(400).json({ status:false, error });
            })
    },

    Logout: function(request, response){
        // delete request.session.user;
        return response.json({ status:true, data:request.session })
    }

}