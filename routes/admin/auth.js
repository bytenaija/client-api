let express = require('express')
const router = express.Router();

const AdminAuthController = require('../../controllers/admin/auth')


router.post('v1/admin/login', AdminAuthController.login)
router.post('v1/admin/createUser', AdminAuthController.createUser)

module.exports = router
