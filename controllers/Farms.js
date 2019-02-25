const Farms = require('../models/Farms');
const User = require('../models/User');
const moment = require('moment')
let uuid = require('node-uuid')
const {
  verify
} = require('../config/jwt')
let winston = require('../config/winston');



let QueueJobs = require('../services/queue')
let Widthdrawal = require('../models/Withdrawal')

module.exports = {
  getAllFarms: (req, res, next) => {

    Farms.find({}).populate('userId')
      .then(farms => {
        console.log(farms)
        farms = farms.filter((farm) => farm.userId.firstname)
        console.log(farms);
        res.status(200).json({
          success: true,
          farms
        })

      })
      .catch(err => {
        winston.error(err)
        return res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later'
        })
      })

  },

  getROIDueFarms: (req, res) => {
    const io = req.io;
    let today = moment().toISOString();
    Farms.find({
        dateOfROI: today,
        status: 'unpaid'
      })
      .then(farms => {
        if (!farms) {
          return res.status(404).json({
            success: false,
            message: 'Invalid credentials'
          })
        } else {
          res.status(200).json({
            success: true,
            farms
          })
        }
      })
      .catch(err => {
        winston.error(err)
        return res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later'
        })
      })
  },

  createFarm: (req, res, next) => {
    const io = req.io;
    const queue = req.queue;
    const redisClient = req.redisClient
    const verification = verify(req, res, next);

    if (verification) {

      let farm = {
        numberOfGoats,
        profit,
        amountInvested
      } = req.body
      farm.reference = uuid() + Date.now();
      farm.userId = verification.user._id;
      farm.dateOfROI = moment().add(6, 'months').toISOString();


      winston.info("Farmmsmsmsm creation", farm)
      Farms.create(farm)
        .then(farm => {
          if (!farm) {
            return res.status(404).json({
              success: false,
              message: 'Sorry and error occured. We could not create your farm'
            })
          } else {
            User.findOne({
              email: verification.user.email
            }).then(user => {
              user.farms.push(farm._id);
              user.save();
              QueueJobs.createFeedJobs(queue, io, redisClient.get(user._id.toString()));
              // QueueJobs.createEmailJob(queue, user.email, user.password, user.firstname, 'ForgotPassword' )
            })
            io.sockets.emit('Farm Added', farm);
            let notification = {
              title: `A new farm created (${moment().format('YYYY')} - ${moment().add(6, 'months').format('YYYY')})`,
              date: moment(),
              read: false
            };
            io.sockets.emit('notification', notification)
            res.status(200).json({
              success: true,
              farm
            })
          }
        })
        .catch(err => {
          winston.error(err)
          return res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later'
          })
        })
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorised to access this resource'
      })
    }
  },

  withDrawROI: (req, res, next) =>{
    const verification = verify(req, res, next);

     if (verification) {
      req.body.user = verification.user._id;
        Widthdrawal.create(req.body).then(async widthrawal =>{
          let counter = 0;
          for(farm of widthrawal.farmsDue){

            Farms.findById(farm).then(frm =>{
              winston.info(frm)
              frm.status = 'withdrawn'
              frm.save();

              counter += 1;
              if(counter == widthrawal.farmsDue.length - 1){
                winston.info("Counting", counter, widthrawal.farmsDue.length - 1)
                res.status(200).json({success: true, message: 'Successfully Withdrawn your investments'});
              }

            });

          }
        }).catch(err => {
          winston.info("Erro from withdraw", err)
          res.status(500).json({success: false, err})
        })
     }
  },

  editFarm: (req, res) => {
    let {
      id
    } = req.params;

    Farms.findByIdAndUpdate(id, req.body).then(farm => {
      winston.info(farm)
        res.status(200).json({
          success: true,
          message: 'Your farm edit has been successfully saved'
        })

    }).catch(err =>{
      res.status(500).json({
        success: false,
        err,
        message: "An error occured and we could not save your changes. Pelase try again"
      })
    })
  },

  deleteFarm: async (req, res) => {
    let {
      id
    } = req.params;

    let farm = await Farms.findById(id)
    winston.info(farm)

    Farms.findByIdAndRemove(id).then(farm => {
     User.findById(farm.userId).then(user =>{
       if(user){
        user.farm = user.farms.filter(farm => farm.toString() !== id.toString());
        user.save()
       }
       res.status(200).json({
        success: true,
        message: 'Farm Successfully deleted'
      })
     })

      }).catch(e =>{
        res.status(500).json({success: false, e})
      })

  }
}