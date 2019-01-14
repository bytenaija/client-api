let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const AddressController = require('../controllers/Address')



router.get('/v1/', verifyToken, AddressController.getAllAddress)
router.post('/v1/', verifyToken, AddressController.createAddress)
router.patch('/v1/:id', verifyToken, AddressController.editAddress)

module.exports = router
