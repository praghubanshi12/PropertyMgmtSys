const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req,res,next) => {
    var token;
    if('authorization' in req.headers){
        token = req.headers['authorization'].split(' ')[1];
    }
    if(!token){
        res.status(403).send({auth: false, message: "No token provided"});
    }else{
        jwt.verify(token, "Secret@123", (err, decoded)=> {
            if(err){
                res.status(500).send({auth: false, message: "Token authentication failed"});
            }else{
                req._id = decoded._id;
                next();
            }
        })
    }
}