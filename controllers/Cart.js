let Cart = require('../models/Cart');
let Order = require('../models/Order');

module.exports = {
    saveCart = (req, res, next) =>{

    },

    editCart = (req, res, next) =>{

    },

    deleteCart = (req, res, next) =>{

    },

    getCarts = (req, res, next) =>{
        Cart.find({})
        .populate('cartItems')
        .exec()
        .then(carts =>{
            res.status(200).json({success: true, carts})
        })
        .catch(err =>{
            console.log(err)
            return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
        })
    },

    getCart = (req, res, next) =>{

    },
}