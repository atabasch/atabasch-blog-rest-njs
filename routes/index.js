var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")
var secretKey = process.env.SECRET_KEY

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


let userData = {
    id:        1,
    username: "atabas61",
    password: "atabas61"
}
router.post('/login', function(request, response){
    let postData = request.body.user;
    //todo: login işlemini yap ↓
    if(postData.username != userData.username || postData.password != userData.password){
        return response.status(403).send();
    }else{
        let jwtPayload = {
            userId:     userData.id,
            userName:   userData.username,
            admin:      true,
            iat:        Math.floor(Date.now() / 1000),
            exp:        Math.floor(Date.now() / 1000) + 30//(60 * 60) // 1. saatlik token
        }
        jwt.sign(jwtPayload, secretKey, { algorithm: 'HS512' }, function(err, token){
            if(err){
                return response.status(400).json({status:false, message:"error", err})
            }else{
                return response.status(200).json({status:true, token:token})
            }
        })

    }
});





var Comment = require("../models/Comment")
router.get("/yorumlar", function(request, response){
    Comment.findAll({
        
    })
        .catch(function(error){
            return response.status(400).json({status:false, ...error});
        })
        .then(function(result){
            return  response.json({comments:result})
        })

})
module.exports = router;
