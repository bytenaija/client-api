const Farms = require('../models/Farms');
const moment = require('moment')


module.exports = {
  getAllFarms : (req, res)=>{
    Farms.find({})
      .then(farms =>{
        if(!farms){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
          res.status(200).json({success: true, farms})
        }
      })
      .catch(err =>{
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },

  getROIDueFarms : (req, res)=>{
      let today = moment().toISOString();
    Farms.find({dateOfROI: today, status: 'unpaid'})
      .then(farms =>{
        if(!farms){
          return res.status(404).json({success: false, message: 'Invalid credentials'})
        }else{
          res.status(200).json({success: true, farms})
        }
      })
      .catch(err =>{
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },
}