/* eslint-disable quote-props */
/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const User = require('../models/User');
const {
  jwtSign,
} = require('../config/jwt');
const ForgotPassword = require('../models/ForgotPassword');

const EmailService = require('../services/EmailService');
const {
  jwtKey,
} = require('../config/keys');

const winston = require('../config/winston');
const Notification = require('../models/Notification');


module.exports = {
  login: (req, res) => {
    const { io, redisClent } = req;


    let {
      username,
      password,
    } = req.body;
    username = `^${username}$`;
    User.findOne({
      username: { $regex: username, $options: 'i' },
    }).populate(['adresses', 'carts', 'farms'])
      .then((user) => {
        if (!user) {
          User.findOne({ email: { $regex: username, $options: 'i' } }).populate(['adresses', 'carts', 'farms']).then((user) => {
            if (!user) {
              return res.status(404).json({
                success: false,
                message: 'Invalid credentials',
              });
            } else {
              user.comparePassword(user.password, password, (err, isMatch) => {
                if (isMatch) {
                  const body = { _id: user._id, email: user.email };


                  // eslint-disable-next-line no-shadow
                  jwtSign({ user: body }, (err, token) => {
                    if (err) {
                      winston.error('Login', err);
                      return res.status(500).json({
                        success: false,
                        message: 'An error occured. Please try again later',
                      });
                    }
                    const twoDays = moment().add(-2, 'days');

                    Notification.find({ type: 'admin', createdAt: { '$gt': twoDays } }).then((notifications) => {
                      winston.info(notifications);
                      if (notifications.length > 0) {
                        io.sockets.emit('notification', notifications);
                      }
                    }).catch(err => console.log(err));
                    Notification.find({ userId: user._id, createdAt: { '$gt': twoDays } }).then((notifications) => {
                      winston.info(notifications);
                      if (notifications.length > 0) {
                        io.sockets.emit('notification', notifications);
                      }
                    }).catch(err => console.log(err));
                    res.status(200).json({
                      success: true,
                      user,
                      token,
                    });
                  });
                } else {
                  return res.status(404).json({
                    success: false,
                    message: 'Invalid credentials',
                  });
                }
              });
            }
          });
        } else {
          user.comparePassword(user.password, password, (err, isMatch) => {
            if (isMatch) {
              const body = { _id: user._id, email: user.email };


              jwtSign({ user: body }, (err, token) => {
                if (err) {
                  winston.error('Login', err);
                  return res.status(500).json({
                    success: false,
                    message: 'An error occured. Please try again later',
                  });
                }

                const twoDays = moment().add(-2, 'days');

                Notification.find({ type: 'admin', createdAt: { '$gt': twoDays } }).then((notifications) => {
                  winston.info(notifications);
                  if (notifications.length > 0) {
                    io.sockets.emit('notification', notifications);
                  }
                }).catch(err => console.log(err));
                Notification.find({ userId: user._id, createdAt: { '$gt': twoDays } }).then((notifications) => {
                  winston.info(notifications);
                  if (notifications.length > 0) {
                    io.sockets.emit('notification', notifications);
                  }
                }).catch(err => console.log(err));
                res.status(200).json({
                  success: true,
                  user,
                  token,
                });
              });
            } else {
              return res.status(404).json({
                success: false,
                message: 'Invalid credentials',
              });
            }
          });
        }
      })
      .catch((err) => {
        winston.error('Error in login', err);
        return res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later',
        });
      });
  },

  signup: (req, res) => {
    const { io } = req;
    const user = {
      username,
      password,
      firstname,
      lastname,
      country,
      state,
      email,
    } = req.body;

    User.create(user).then((user) => {
      if (user) {
        const body = { _id: user._id, email: user.email };

        jwtSign({ user: body }, (err, token) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'An error occured. Please try again later',
            });
          }

          io.sockets.emit('User Added', user);
          res.status(200).json({
            success: true,
            user,
            token,
          });
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Your account could not be created. Please try again',
        });
      }
    })
      .catch((err) => {
        winston.error('/controllers/Auth - ln: 124', err);

        if (err.code === 11000) {
          // email or username could violate the unique index. we need to find out which field it was.
          // var field = err.errmsg.split(".$")[1];
          var field = err.errmsg.split(' dup key')[0];
          var field = err.errmsg.split(' index:')[1];
          field = field.substring(0, field.lastIndexOf('_'));

          return res.status(500).json({
            success: false,
            message: `${field} already exist in the database`,
          });
        }
        return res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later',
        });
      });
  },


  forgotPassword: (req, res) => {
    User.findOne({
      email: req.body.email,
    })
      .then(async (user) => {
        if (user) {
          const code = generator.generate({
            length: 300,
            numbers: true,
            uppercase: true,
          });

          await ForgotPassword.findOneAndRemove({
            email: user.email,
          });

          ForgotPassword.create({
            email: user.email,
            code,
          }).then(async (response) => {
            const link = `http://localhost:5000/api/auth/v1/password-recovery/?code=${code}`;
            await EmailService.email(response.email, link, user.firstname, 'ForgotPassword');
            res.status(200).json({
              success: true,
            });
          }).catch((err) => {
            console.dir(err);
            res.status(500).json({
              success: false,
              message: 'An error occured. Please try again later',
            });
          });
        }
      }).catch(
        (err) => {
          console.dir(err);
          res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later',
          });
        },
      );
  },

  passwordRecovery: (req, res) => {
    const {
      code,
    } = req.query;
    ForgotPassword.findOne({
      code,
    })
      .then((user) => {
        if (user) {
          User.findOneAndUpdate({
            email: user.email,
          }, {
            password: req.body.password,
          })
            .then(() => {
              res.status(200).json({
                success: true,
                message: 'Password Successfully Changed',
              });
            }).catch((err) => {
              console.dir(err);
              res.status(500).json({
                success: false,
                message: 'An error occured. Please try again later',
              });
            });
        }
      }).catch((err) => {
        console.dir(err);
        res.status(500).json({
          success: false,
          message: 'An error occured. Please try again later',
        });
      });
  },

  getUserByToken: (req, res) => {
    const {
      token,
    } = req.body;

    const user = jwt.verify(token, jwtKey, (err, authData) => {
      if (err) {
        return false;
      }

      return authData;
    });


    if (user) {
      User.findOne({
        email: user.user.email,
      }).populate('addresses').populate('carts').populate('farms')
        .populate('gifts')
        .populate('profile')
        .then((user) => {
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'Invalid token',
            });
          } else {
            jwtSign({ user: { _id: user._id, email: user.email } }, (err, token) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'An error occured. Please try again later',
                });
              }
              user.token = token;
              user.save();

              res.status(200).json({
                success: true,
                user,
                token,
              });
            });
          }
        })
        .catch((err) => {
          winston.error('Erroror', err);

          return res.status(401).json({
            success: false,
            message: 'Invalid token',
          });
        });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid token',
      });
    }
  },
};
