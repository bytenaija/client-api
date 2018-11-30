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
  }
}
