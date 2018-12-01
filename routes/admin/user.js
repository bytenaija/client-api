let express = require('express')
const router = express.Router();

const AdminUserController = require('../../controllers/admin/user')


router.get('/v1/getallusers', AdminUserController.getAllUsers)


module.exports = router
