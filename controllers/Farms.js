const Farms = require('../models/Farms');
const User = require('../models/User');
const moment = require('moment')
let uuid = require('node-uuid')
const {verify} = require('../config/jwt')

module.exports = {
  getAllFarms : (req, res, next)=>{
    
    Farms.find({})
      .then(farms =>{
        
          res.status(200).json({success: true, farms})
        
      })
      .catch(err =>{
        console.log(err)
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
    
  },

  getROIDueFarms : (req, res)=>{
    const io = req.io;
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
        console.log(err)
        return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
      })
  },

  createFarm : (req, res, next)=>{
    const io = req.io;
    const verification = verify(req, res, next);
    console.log(verification)
    if (verification) {
      
      let farm = {numberOfGoats, profit, amountInvested} = req.body
      farm.reference = uuid() + Date.now();
      farm.userId = verification.user._id;
      farm.dateOfROI = moment().add(6, 'months').toISOString();
     
  Farms.create(farm)
    .then(farm =>{
      if(!farm){
        return res.status(404).json({success: false, message: 'Sorry and error occured. We could not create your farm'})
      }else{
        User.findOne({email: verification.user.email}).then(user =>{
          user.farms.push(farm._id);
          user.save();
        })
        io.sockets.emit('Farm Added', farm);
        let notification = {title:`A new farm created (${moment().format('YYYY')} - ${moment().add(6, 'months').format('YYYY')})`, date: moment(), read: false};
        io.sockets.emit('notification', notification)
        res.status(200).json({success: true, farm})
      }
    })
    .catch(err =>{
      console.log(err)
      return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
    })
  }else{
    return res.status(403).json({success: false, message: 'You are not authorised to access this resource'})
  }
},
}