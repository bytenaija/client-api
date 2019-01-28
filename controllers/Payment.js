let {payment, sendOTP} = require('../services/paystack');
let {verify} = require('../config/jwt')
let Order = require('../models/Order')
let Cart = require('../models/Cart')
let Farm = require('../models/Farms')
let Transaction = require('../models/Transaction')
let User = require('../models/User')
var winston = require('../config/winston');

module.exports = {
    sendOTP: (req, res, next) =>{
        let {otp, reference, farm, chargeReference } = req.body;
        let verification = verify(req, res, next);
        winston.info("This is OTP sending on line 13 on Payment controller",req.body);
        sendOTP(reference, otp).then(chargeResponse =>{
            winston.info'line 15, reolved true', chargeResponse, verification)
            
            
            
            
            
            if(chargeResponse){
              
               
                    User.findById(verification.user._id).then( async user =>{
                        await Transaction.create({reference, amount, from: user.firstname + " " +  user.lastname, to: 'Goatti.ng', email: user.email})
                    })
                    
                
              
                if(farm){
                      Farm.findOne({chargeReference}).then(farm =>{
                        if(farm){
                            farm.status = 'Paid';
                            farm.save();
                            
                                io.sockets.emit('Farm Payment', farm);
                          
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                        winston.error("farm update error Payment.js line 43", err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }else{
                    Order.findOne({chargeReference}).then(order =>{
                        if(order){
                            order.status = 'Paid';
                            order.save();
                            Cart.findOneAndUpdate({_id: order.cartId}, {status: 'Paid'}).exec().then(cart =>{
                              
                                io.sockets.emit('Order Payment', order);

                                
                            })
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                      winston.error("Order update error Payment.js line 55", err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }
                
            }else{
                res.status(500).json({success: false, message: 'Payment not successful', errorMessage: chargeResponse});
            }
        }).catch(err =>{
            winston.error("Error at Send OTP line 64 Payment.js", err)
            res.status(500).json({success: false, message: 'Payment not successful', errorMessage: err});
        })
    },
    paystackPayment:  (req, res, next) =>{
        const io = req.io;

        winston.info("this is request.body in paystack 68", req.body)
        let {number, cvv, expiry_month, expiry_year, amount, reference, farm, pin} = req.body
        
        let verification = verify(req, res, next);
        if(verification){
         let paymentReference = Date.now();
            let email = verification.user.email;
            payment(number, cvv, expiry_month, expiry_year, pin, amount, email, paymentReference)
            .then(async chargeResponse =>{

                winston.info('chargesgsgsgsgsgsgsg 76', chargeResponse)
                if(chargeResponse){
                    
                        User.findById(verification.user._id).then( async user =>{
                            await Transaction.create({reference, amount, from: user.firstname + " " +  user.lastname, to: 'Goatti.ng', email: user.email})
                        })
                        
        
                await Transaction.create({reference: paymentReference, amount, from: verification.user.firstname + " " +  verification.user.lastname, to: 'Goatti.ng', email})
                if(farm){
                      Farm.findOne({reference}).then(farm =>{
                        if(farm){
                            farm.status = 'Paid';
                            farm.save();
                            
                                io.sockets.emit('Farm Payment', farm);
                          
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                        winston.error(err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }else{
                    Order.findOne({reference}).then(order =>{
                        if(order){
                            order.status = 'Paid';
                            order.save();
                            Cart.findOneAndUpdate({_id: order.cartId}, {status: 'Paid'}).exec().then(cart =>{
                               
                                io.sockets.emit('Order Payment', order);

                                
                            })
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                        winston.error("Payment Errorsssssss", err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }
                
            }else{
                winston.info("Just checking",  err,  farm? true: false,  reference)
                res.status(500).json({success: false, message: 'Payment not successful', errorMessage: err, farm : farm? true: false, chargeReference: reference});
            }
            }).catch( async err =>{
                winston.error("Erororororororor from snedoing pin", err);
                if(err.status == 'send_otp'){
                    res.status(500).json({success: false, message: 'Send OTP', errorMessage: err});
                }else{
                    if(farm){
                 
                        await Farm.findOneAndDelete({reference})
                    }else{
                        await   Order.findOneAndDelete({reference})
                    }

                    res.status(500).json({success: false, message: 'Payment not successful', errorMessage: err});
                }
               
              
               
            })
        }else{
            res.status(401).json({success: false, message: 'You must sign in before making a purchase'});
        }
    }
}