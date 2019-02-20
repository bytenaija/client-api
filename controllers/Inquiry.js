let Inquiry = require('../models/Inquiry');
const {
  verify
} = require('../config/jwt')
var winston = require('../config/winston');

let User = require('../models/User');
let EmailService = require('../services/EmailService')

module.exports = {
  getInquiries: (req, res, next) => {
    let sender = extractuserId(req, res, next);
    if (sender) {
      Inquiry.find({}).populate('sender').then(inquiries => {
        res.status(200).json({
          success: true,
          inquiries
        })
      }).catch(err => {
        winston.error(err)
        res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later.'
        })
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'User must be authenticated.'
      })
    }

  },
  addInquiry: (req, res, next) => {
    try {
      let sender = extractuserId(req, res, next);
      if (sender) {
        req.body.sender = sender;
        Inquiry.create(req.body).then(inquiry => {
          User.findOne({
            _id: sender
          }).then(user => {
            EmailService.emailInquiry(req.body.email, user.firstname, 'Inquiry');

            res.status(200).json({
              success: true,
              inquiry
            })
          })

        }).catch(err => {
          winston.error(err)
          res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later.'
          })
        })



      } else {
        res.status(401).json({
          success: false,
          message: 'User must be authenticated.'
        })
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'An error occured. Please try again later.'
      })
    }
  },
  editInquiry: (req, res, next) => {
    let sender = extractuserId(req, res, next);
    if (sender) {
      Inquiry.findByIdAndUpdate(req.params.id, req.body).then(inquiry => {

        res.status(200).json({
          success: true,
          inquiry
        })
      }).catch(err => {
        winston.error(err)
        res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later.'
        })
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'User must be authenticated.'
      })
    }
  },
}

const extractuserId = (req, res, next) => {
  let verification = verify(req, res, next);
  if (verification) {
    return verification.user._id;

  } else {
    return null;
  }
}