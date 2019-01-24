const User = require('../../models/User');


module.exports = {
  getAllUsers : (req, res)=>{
    User.find({})
      .then(users =>{
        if(!users){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
          res.status(200).json({success: true, users})
        }
      })
      .catch(err =>{
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },
}