/* eslint-disable */

const Admin = require('../../models/admin/User');
const {jwtVerify, jwtSign} = require('../../config/jwt')
var winston = require('../../config/winston');

module.exports = {
  login : (req, res)=>{
    const { username, password} = req.body;
    Admin.findOne({email: username})
      .then(admin =>{
        console.log(admin);
        if(!admin){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
        admin.comparePassword(admin.password, password, (err, isMatch) => {
          if (isMatch) {
            let body = {
              _id: admin._id,
              email: admin.email
            };


            jwtSign({
              admin: body
            }, (err, token) => {
              if (err) {
                winston.error("Login", err)
                return res.status(500).json({
                  success: false,
                  message: 'An error occured. Please try again later'
                })
              } else {

                res.status(200).json({
                  success: true,
                  admin,
                  token
                })


              }
            });

          } else {
            return res.status(404).json({
              success: false,
              message: 'Invalid credentials'
            })
          }
        });
      }
    })
      .catch(err =>{
        console.log(err)
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },

  createUser: (req, res)=>{
    const admin = {password, firstname, lastname, email} = req.body;
    Admin.create(admin).then(admin =>{
      if(admin){
        res.status(200).json({success: true, admin})
      }else{
          return res.status(404).json({success: false, message: 'Your account could not be created. Please try again'})
      }

    })
    .catch(err =>{
      winston.error(err)
      return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
    })
  },

  getAdminByToken: (req, res) =>{
   Admin.getAdminByToken(req.body.token)
  }
}
