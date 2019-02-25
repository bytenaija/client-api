let Notification = require('../models/Notification')
let {verify} = require('../config/jwt')
const winston = require('../config/winston');

module.exports = {
    getNotifications: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
          //  console.log(verification)
            Notification.find({userId: verification.user.email}).then(transactions =>{
                res.status(200).json({success: true, transactions});
            }).catch(err =>{
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    getNotification: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
            Notification.find({email: verification.email, _id: req.params.id}).then(transaction =>{
                res.status(200).json({success: true, transaction});
            }).catch(err =>{
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    updateNotification: (req, res) => {

    },
    deleteNotification: (req, res) => {

    },

    addNotification: (req, res) =>{
      const io = req.io;
      Notification.create(req.body).then(notification =>{
        io.sockets.emit('notification', notification.notification);
        winston.info(notification);
        res.json({success: true, notification});
      }).catch(err =>{
        winston.error(err)
        res.status(500).json({success: false, message: "An error an occured. Try again later"})
      })
    }
}