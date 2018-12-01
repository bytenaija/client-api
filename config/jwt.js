const jwt = require('jsonwebtoken');
const {jwtKey} = require('./keys')
module.exports ={
  jwtVerify : (token) =>{
    jwt.verify(token, jwtKey)
  },

  jwtSign : (user, cb) =>{
    console.log("JWT", user)
    jwt.sign({user}, jwtKey, (err, token)=>{
      if(err){
        cb(err)
      } else{
        cb(null, token)
      }

    })
  },


verifyToken: (req, res, next)=> {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        next()
    }
},

verify: (req, res, next) => {
    //console.log("Logging " + req.token)
    return jwt.verify(req.token, jwtKey, (err, authData) => {
        if (err) {
            return false
        } else {

            return authData;
        }


    });
}
}
