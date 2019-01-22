const Address = require('../models/Address')
const Farm = require('../models/Farms')
const Cart = require('../models/Cart')
const User = require('../models/User');
const {
  jwtVerify,
  jwtSign
} = require('../config/jwt');
const ForgotPassword = require('../models/ForgotPassword')
const generator = require('generate-password')
const uuid = require('uuid/v5')
const EmailService = require('../services/EmailService')
const url = require('url');
const {
  jwtKey
} = require('../config/keys')
const jwt = require('jsonwebtoken');


module.exports = {
    login: (req, res) => {

      const {
        username,
        password
      } = req.body;
      User.findOne({
          username
        }).populate(['adresses', 'carts', 'farms'])
        .then(user => {
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'Invalid credentials'
            })
          } else {

            user.comparePassword(user.password, password, (err, isMatch) => {
              if (isMatch) {
                jwtSign({user: {_id: user._id, email: user.email}}, (err, token) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: 'An error occured. Please try again later'
                    })
                  } else {
                    user.token = token;
                    user.save();
                    //console.log("Token", token)
                    res.status(200).json({
                      success: true,
                      user,
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
        .catch(err => {
          console.dir(err)
          return res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later'
          })
        })
    },

    signup: (req, res) => {
      const io = req.io;

      const user = {
        username,
        password,
        firstname,
        lastname,
        country,
        state,
        email
      } = req.body;
    //  console.log("Creating", user)
      User.create(user).then(user => {
          if (user) {
            jwtSign({user: {_id: user._id, email: user.email}}, (err, token) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'An error occured. Please try again later'
                })
              } else {
                user.token = token;
                user.save();

                io.sockets.emit('User Added', user);
                res.status(200).json({
                  success: true,
                  user, token
                })
              }
            });
          } else {
            return res.status(404).json({
              success: false,
              message: 'Your account could not be created. Please try again'
            })
          }

        })
        .catch(err => {
          console.dir(err)
          return res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later'
          })
        })
    },



    forgotPassword: (req, res) => {
      User.findOne({
          email: req.body.email
        })
        .then(async user => {
          if (user) {
            let code = generator.generate({
              length: 300,
              numbers: true,
              uppercase: true
            });

           // console.log(code)
           // console.log(user.email)

            await ForgotPassword.findOneAndRemove({
              email: user.email
            });

            ForgotPassword.create({
              email: user.email,
              code
            }).then(async response => {
              let link = `http://localhost:5000/api/auth/v1/password-recovery/?code=${code}`
              await EmailService.email(response.email, link, user.firstname, "ForgotPassword");
              res.status(200).json({
                success: true
              });
            }).catch(err => {
              console.dir(err);
              res.status(500).json({
                success: false,
                message: 'An error occured. Please try again later'
              })
            })
          }
        }).catch(
          err => {
            console.dir(err);
            res.status(500).json({
              success: false,
              message: 'An error occured. Please try again later'
            })
          }
        )
    },

    passwordRecovery: (req, res) => {
      let {
        code
      } = req.query;
      ForgotPassword.findOne({
          code
        })
        .then(user => {
          if (user) {
            User.findOneAndUpdate({
                email: user.email
              }, {
                password: req.body.password
              })
              .then(user => {
                res.status(200).json({
                  success: true,
                  message: 'Password Successfully Changed'
                })
              }).catch(err => {
                console.dir(err)
                res.status(500).json({
                  success: false,
                  message: 'An error occured. Please try again later'
                })
              })
          }
        }).catch(err => {
          console.dir(err)
          res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later'
          })
        })
    },

    getUserByToken: (req, res, next) => {
      let {
        token
      } = req.body;

      console.log(token)

      let user = jwt.verify(token, jwtKey, (err, authData) => {
        if (err) {
          return false
        } else {

          return authData;
        }


      });

      //console.log("user", user)
      if (user) {
        User.findOne({
            email: user.user.email
          }).populate('addresses').populate('carts').populate('farms').populate('gifts').populate('profile')
          .then(user => {
              if (!user) {
                return res.status(404).json({
                  success: false,
                  message: 'Invalid token'
                })
              } else {
                jwtSign({user: {_id: user._id, email: user.email}}, (err, token) => {
                  console.log("Tojejejejejeje", token)
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        message: 'An error occured. Please try again later'
                      })
                    } else {
                      user.token = token;
                      user.save();
                     // console.log("Token", token)
                      res.status(200).json({
                        success: true,
                        user,
                        token
                      })
                    }
                  })
                }
              }).catch(err => {
              console.log("Erroror", err);

              return res.status(404).json({
                success: false,
                message: 'Invalid token'
              })
            })
          }
        else {

          return res.status(404).json({
            success: false,
            message: 'Invalid token'
          })
        }


      }
    }
