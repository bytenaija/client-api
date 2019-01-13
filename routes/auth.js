let express = require('express')
const router = express.Router();
const AuthController = require('../controllers/Auth')


router.post('/v1/login', AuthController.login)
router.post('/v1/signup', AuthController.signup)
router.post('/v1/forgotpassword', AuthController.forgotPassword)
router.post('/v1/password-recovery', AuthController.passwordRecovery)
router.get('/v1/token', AuthController.getUserByToken)

module.exports = router
