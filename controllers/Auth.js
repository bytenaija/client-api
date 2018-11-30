const User = require('../models/User');
const {jwtVerify, jwtSign} = require('../config/jwt')


module.exports = {
  login :  (req, res)=>{
    const {username, password} = req.body;
    User.findOne({username})
      .then(user =>{
        if(!user){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
        //  console.dir(user)
        user.comparePassword(user.password, password, (err, isMatch)=>{
          if(isMatch){
            jwtSign(user, (err, token)=>{
              if(err){
                  return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
              }else{
                user.saveToken(token)
                
                res.status(200).json({success: true, token, user})
              }
            });

          }else{
            return res.status(404).json({success: false, message: 'Invalid credentials'})
          }
        });


        }
      })
      .catch(err =>{
        console.dir(err)
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },

  signup: (req, res)=>{
    const user = {username, password, firstname, lastname, country, state, email} = req.body;
    User.create(user).then(user =>{
      if(user){
        let token = jwtSign(user);
        user.saveToken(token)
        res.status(200).json({success: true, token, user})
      }else{
          return res.status(404).json({success: false, message: 'Your account could not be created. Please try again'})
      }

    })
    .catch(err =>{
      console.dir(err)
      return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
    })
  },

  getUserByToken: (req, res) =>{
   User.getUserByToken(req.body.token)
  }
}
