let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const FarmController = require('../controllers/Farms')

console.log(verifyToken)

router.get('/v1/getallfarms', FarmController.getAllFarms)
router.post('/v1/createfarm', verifyToken, FarmController.createFarm)

module.exports = router
