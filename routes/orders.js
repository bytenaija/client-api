let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const PaymentController = require('../controllers/Payment')
const OrderController = require('../controllers/Order')
const CartController = require('../controllers/Cart')



//payment operations
router.post('/v1/payment', verifyToken, PaymentController.paystackPayment)
// router.get('/v1/payments', verifyToken, PaymentController.getAllPayments)

// //orders operations
router.post('/v1', verifyToken, OrderController.create)
router.get('/v1', verifyToken, OrderController.getAllOrders)
router.get('/v1/:id', verifyToken, OrderController.getOrder)
router.put('/v1/:id', verifyToken, OrderController.edit)
router.delete('/v1/new', verifyToken, OrderController.delete)

// //cart operations
// router.get('/v1/cart/:id', verifyToken, CartController.getCart)
router.post('/v1/cart', verifyToken, CartController.saveCart)
router.put('/v1/cart/:id', verifyToken, CartController.editCart)
// router.delete('/v1/cart/:id', verifyToken, CartController.delete)
router.get('/v1/cart/all', verifyToken, CartController.getCarts)

module.exports = router
