let express = require('express')
const router = express.Router();

const FarmController = require('../controllers/Farms')


router.get('/v1/getallfarms', FarmController.getAllFarms)


module.exports = router
