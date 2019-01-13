let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const FarmController = require('../controllers/Farms')



router.get('/v1/', FarmController.getAllFarms)
router.post('/v1/', verifyToken, FarmController.createFarm)
router.patch('/v1/:id', verifyToken, FarmController.editFarm)

module.exports = router
