let Cart = require('../models/Cart');
let Product = require('../models/Product');
let Order = require('../models/Order');
let CartItem = require('../models/CartItem')
let User = require('../models/User')
let {verify} = require('../config/jwt')

module.exports = {
    saveCart : async (req, res, next) =>{
        let verification = verify(req, res, next);
        if(verification){
            User.findById(verification.user._id).populate('carts').then(user =>{
                console.log(user)
            })
            // await Cart.findAndRemoveMany({userId: verification.user._id, status: 'Uncomplete'})

            req.body.userId = verification.user._id;
            Cart.create(req.body).then(cart =>{
                let cartitems = []
                req.body.cartitems.forEach(cartItem =>{
                    cartItem.cartId = cart._id;
                    cartitems.push(cartItem)
                })
                console.log("Cart items", cartitems)

                CartItem.insertMany(cartitems).then(cItems =>{
                    cItems.forEach(cItem => {
                        cart.cartItems.push(cItem._id);
                    });
                   console.log("Cart: ", cart)
                    cart.save();
                    User.findById(cart.userId).then(user =>{
                        user.carts.push(cart._id);
                        user.save();
                    })
                    Cart.findById(cart._id).populate('userId')
                    .populate({ path:'cartItems',
                    populate: {
                        path: 'productId',
                        model: 'Product'
                      } }).then(cart =>{
                        res.status(200).json({success: true, cart})   
                       })
                }).catch(err =>{
                    console.log(err)
                    return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
                })
                // res.status(200).json({success: true, cart})
            })
            .catch(err =>{
                console.log(err)
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }
    },

    editCart : (req, res, next) =>{
        let {id} = req.params;
        console.log("Req.body", req.body)
            Cart.findOneAndUpdate({_id: id}, req.body).then(async mainCart =>{
              await  req.body.cartitems.forEach(cItem =>{
                    CartItem.findOne({productId: cItem.productId, cartId: id }).then(cart =>{
                        console.log("cartddddddddd",cart);
                        if(cart){
                            cart.quantity += cItem.quantity;
                            cart.save();
                            
                        }else{
                            CartItem.create(cItem)
                            .then(cart =>{
                                mainCart.cartItems.push(cart._id);
                                mainCart.save();
                            })
                        }
                    })
                })
               
               Cart.findById(id).populate('userId')
               .populate({ path:'cartItems',
               populate: {
                   path: 'productId',
                   model: 'Product'
                 } }).then(cart =>{
                res.status(200).json({success: true, cart})   
               })
               
                   
                }).catch(err =>{
                    console.log(err)
                    return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
                })
                // res.status(200).json({success: true, cart})
          
            .catch(err =>{
                console.log(err)
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        
    },

    deleteCart : (req, res, next) =>{
        Cart.findOneAndDelete(req.params.id).then(cart =>{
            return res.status(500).json({success: true, message: 'Cart successfully deleted'})
        }).catch(err =>{
            console.log(err)
            return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
        })
    },

    getCarts : (req, res, next) =>{
        Cart.find({})
        .populate('userId')
        .populate({ path:'cartItems',
        populate: {
            path: 'productId',
            model: 'Product'
          } })
        .exec()
        .then(carts =>{
            res.status(200).json({success: true, carts})
        })
        .catch(err =>{
            console.log(err)
            return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
        })
    },

    getCart : (req, res, next) =>{
        Cart.findById(req.params.id)
        .populate('userId')
        .populate({ path:'cartItems',
        populate: {
            path: 'productId',
            model: 'Product'
          } })
        .exec()
        .then(cart =>{
            res.status(200).json({success: true, cart})
        })
        .catch(err =>{
            console.log(err)
            return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
        })
    },

    deleteProduct: (req, res) =>{
        let {id, productId} =  req.params;
        console.log(id, productId)
        CartItem.findOne({cartId: id, productId}).populate('productId').then(cItem => {
            console.log("citem",cItem)
            Cart.findById(id).then(async cart =>{
                console.log(cart)
                let idx = cart.cartItems.findIndex(element => {
                    console.log(element.toString(), cItem._id.toString())
                    return element.toString() === cItem._id.toString()
                });
                console.log("index", idx)
                if(idx != -1){
                        cart.totalCost -= (cItem.productId.price * cItem.quantity)
                        
                        cart.cartItems.splice(idx, 1);
                        
                        cart.save();
                        await CartItem.findOneAndRemove({cartId: id, productId})
                        res.status(200).json({success: true, message: "Product Deleted"})
                   
                }else{
                    res.status(200).json({success: false, message: "Failed to delete products"})
                }
            }).catch(err =>{
                console.dir(err)
                res.status(500).json({success: false, message: "Failed to delete products"})
            })
        });
        
    }
}