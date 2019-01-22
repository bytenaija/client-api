let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const ProfileController = require('../controllers/Profile')



router.get('/v1/', ProfileController.getProfile)
router.post('/v1/', verifyToken, ProfileController.addProfile)
router.patch('/v1/:id', verifyToken, ProfileController.editProfile)

module.exports = router
