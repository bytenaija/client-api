let {payment} = require('../services/paystack');
let {verify} = require('../config/jwt')
let Order = require('../models/Order')
let Cart = require('../models/Cart')
let Farm = require('../models/Farms')
let Transaction = require('../models/Transaction')

module.exports = {
    paystackPayment:  (req, res, next) =>{
        const io = req.io;
        let {number, cvv, expiry_month, expiry_year, amount, reference, farm} = req.body
     
        let verification = verify(req, res, next);
        if(verification){
         
            let email = verification.user.email;
            payment(number, cvv, expiry_month, expiry_year, amount, email, reference)
            .then(async chargeResponse =>{
                if(chargeResponse.success){
                await Transaction.create({reference, amount, from: verification.user.firstname + " " +  verification.user.lastname, to: 'Goatti.ng', email})
                if(farm){
                      Farm.findOne({reference}).then(farm =>{
                        if(farm){
                            farm.status = 'Paid';
                            farm.save();
                            
                                io.sockets.emit('Farm Payment', farm);
                          
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                        console.log(err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }else{
                    Order.findOne({reference}).then(order =>{
                        if(order){
                            order.status = 'Paid';
                            order.save();
                            Cart.findOneAndUpdate({_id: order.cartId}, {status: 'Paid'}).exec().then(cart =>{
                               // console.log(cart);
                                io.sockets.emit('Order Payment', order);

                                
                            })
                        }
                        
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    }).catch(err =>{
                        console.log("Payment Errorsssssss", err);
                        res.status(200).json({success: true, message: 'Payment Successful'});
                    })
                }
                
            }else{
                res.status(442).json({success: false, message: 'Payment not successful'});
            }
            }).catch(err =>{
                console.log("Errror from payment", err)
                res.status(442).json({success: false, message: 'Payment not successful', err});
            })
        }else{
            res.status(401).json({success: false, message: 'You must sign in before making a purchase'});
        }
    }
}