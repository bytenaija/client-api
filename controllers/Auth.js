const Address = require('../models/Address')
const Farm = require('../models/Farms')
const Cart = require('../models/Cart')
const User = require('../models/User');
const {jwtVerify, jwtSign} = require('../config/jwt')
;


module.exports = {
  login :  (req, res)=>{
    console.log("Logingngngngnn")
    const {username, password} = req.body;
    User.findOne({username}).populate(['adresses', 'carts', 'farms'])
      .then(user =>{
        if(!user){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
        //  console.dir(user)
        user.token = null;
        user.save();
        user.comparePassword(user.password, password, (err, isMatch)=>{
          if(isMatch){
            jwtSign(user, (err, token)=>{
              if(err){
                  return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
              }else{
                user.token = token;
                user.save();
                  console.log("Token", token)
                  res.status(200).json({success: true, user, token})
            
                
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
    const io = req.io;
    
    const user = {username, password, firstname, lastname, country, state, email} = req.body;
    console.log("Creating", user)
    User.create(user).then(user =>{
      if(user){
        jwtSign(user, (err, token)=>{
          if(err){
              return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
          }else{
            user.token = token;
            user.save();

            io.sockets.emit('User Added', user);
            res.status(200).json({success: true, user})
          }
        });
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
