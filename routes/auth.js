let express = require('express')
const router = express.Router();
const AuthController = require('../controllers/Auth')


router.post('/v1/login', AuthController.login)
router.post('/v1/signup', AuthController.signup)


module.exports = router
