const Admin = require('../../models/admin/User');
const {jwtVerify, jwtSign} = require('../../config/jwt')

module.exports = {
  login : (req, res)=>{
    const {username, password} = req.body;
    Admin.findOne({username})
      .then(admin =>{
        if(!admin){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
          if(admin.comparePassword(password)){
            let token = jwtSign(admin);
            admin.saveToken(token)
            res.status(200).json({success: true, token, admin})
          }else{
            return res.status(404).json({success: false, message: 'Invalid credentials'})
          }
        }
      })
      .catch(err =>{
        return res.status(442).json({success: false, message: 'An error occured. Please try again later'})
      })
  },

  createUser: (req, res)=>{
    const admin = {username, password, firstname, lastname, email} = req.body;
    Admin.create(admin).then(admin =>{
      if(admin){
        res.status(200).json({success: true, admin})
      }else{
          return res.status(404).json({success: false, message: 'Your account could not be created. Please try again'})
      }

    })
    .catch(err =>{
      return res.status(442).json({success: false, message: 'An error occured. Please try again later'})
    })
  },

  getAdminByToken: (req, res) =>{
   Admin.getAdminByToken(req.body.token)
  }
}
