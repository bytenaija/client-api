let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const ProductController = require('../controllers/Product')


router.post('/v1/', verifyToken, ProductController.addProduct)
router.delete('/v1/:id', verifyToken, ProductController.deleteProduct)
router.put('/v1/:id', verifyToken, ProductController.editProduct)
router.get('/v1/',  ProductController.getProducts)
router.get('/v1/:id',  ProductController.getProduct)

module.exports = router
