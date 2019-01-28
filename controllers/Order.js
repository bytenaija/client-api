let Order = require('../models/Order');
let uuid = require('node-uuid');
let {verify} = require('../config/jwt')
let moment = require('moment')
var winston = require('../config/winston');

module.exports = {
    create: (req, res, next)=>{
        let verification = verify(req, res, next);
        if(verification){
            let {cartId, addressId, tax, totalCost} = req.body;
            let reference = uuid() + Date.now();
            let userId = verification.user._id;
            Order.create({cartId, addressId, reference, userId, tax, totalCost})
            .then(order =>{
                if(order){
                    res.status(200).json({success: true, message: 'Order Placed Successful', order});
                }else{
                    res.status(500).json({success: false, message: 'Order could not be processed. Try again please'});
                }
                }).catch(err =>{
                    winston.error(err);
                    res.status(500).json({success: false, message: 'Order could not be processed. Try again please'});
                })
        }else{
            res.status(401).json({success: false, message: 'User must be authenticated'});
        }


    },

    getAllOrders: (req, res, next)=>{
        let {dateFrom, dateTo} = req.query;
        //console.log("params", req.query)
        if(dateFrom || dateTo){
            dateFrom = moment(dateFrom).format();
            dateTo =  moment(dateTo).format()
            //(dateFrom, dateTo)
            Order.find({
                created_at: {
                    $gte: dateFrom,
                    $lte: dateTo
                }
            }).then(orders =>{
                if(orders){
                    res.status(200).json({success: true, orders});
                }else{
                    res.status(200).json({success: false, message: `Could not get all orders between ${dateFrom} and ${dateTo}`}); 
                }
            }).catch(err =>{
                console.error(err);
                res.status(200).json({success: false, message: `Could not get all orders between ${dateFrom} and ${dateTo}`}); 
            })
        }else{
            Order.find({}).then(orders =>{ if(orders){
                res.status(200).json({success: true, orders});
            }else{
                res.status(200).json({success: false, message: `Could not get all orders`}); 
            }
        }).catch(err =>{
            console.error(err);
            res.status(200).json({success: false, message: `Could not get all orders`}); 
        })
        }
    },


    getAllOrdersForAUser: (req, res, next)=>{
        let verification = verify(req, res, next);
        if(verification){
            Order.find({userId: verification.user._id, status: 'Paid'}).populate({
                path: 'cartId',
                populate: { path:'cartItems',
                            model: 'CartItem',
                                    populate: {
                                        path: 'productId',
                                        model: 'Product',
                                        populate: {
                                            path: 'images',
                                            model: 'ProductImage'
                                        }

                                    } }
            }).then(orders =>{ if(orders){
                //console.log(orders)
                res.status(200).json({success: true, orders});
            }else{
                res.status(200).json({success: false, message: `Could not get all orders`}); 
            }
        }).catch(err =>{
            console.error(err);
            res.status(200).json({success: false, message: `Could not get all orders`}); 
        })
    }else{
        res.status(401).json({success: false, message: 'User must be authenticated'});
    }
        
    },


    getOrder: (req, res)=>{
        Order.findById(req.params.id)
        .then(order => { if(order){
            res.status(200).json({success: true, order});
        }else{
            res.status(200).json({success: false, message: `Could not get that order`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not get that order`}); 
    })
    },

    edit: (req, res)=>{
        Order.findByIdAndUpdate(req.params.id, req.body)
        .then(order => { if(order){
            if(order.status = "Paid"){
                Cart.findOneAndUpdate(order.cartId, {status: 'Paid'}).exec().then(cart =>{
                 //   console.log(cart);
                })
            }
            res.status(200).json({success: true, message: "Successfully updated order"});
        }else{
            res.status(200).json({success: false, message: `Could not update order. Please try again`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not update order. Please try again`}); 
    })
    },

    delete: (req, res)=>{
        Order.findByIdAndRemove(req.params.id)
        .then(order => { if(order){
            res.status(200).json({success: true, message: "Successfully deleted order"});
        }else{
            res.status(200).json({success: false, message: `Could not delete order. Please try again`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not delete order. Please try again`}); 
    })
    }
            
}