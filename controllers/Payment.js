let {payment} = require('../services/paystack');
let {verify} = require('../config/jwt')
let Order = require('../models/Order')

module.exports = {
    paystackPayment: (req, res, next) =>{
        let {number, cvv, expiry_month, expiry_year, amount, reference, orderNumber} = req.body
     
        let verification = verify(req, res, next);
        if(verification){
            let email = verification.email;
            payment(number, cvv, expiry_month, expiry_year, amount, email, reference)
            .then(chargeResponse =>{
                Order.find({reference}).then(order =>{
                    order.status = 'Paid';
                    order.save();
                    res.status(200).json({success: true, message: 'Payment Successful'});
                }).catch(err =>{
                    console.log(err);
                    res.status(200).json({success: true, message: 'Payment Successful'});
                })
                
            }).catch(err =>{
                res.status(500).json({success: false, message: 'Payment not successful'});
            })
        }else{
            res.status(401).json({success: false, message: 'You must sign in before making a purchase'});
        }
    }
}