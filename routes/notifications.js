let express = require('express')
const router = express.Router();
const NotificationController = require('../controllers/Notification')
let {verifyToken} = require('../config/jwt')


router.get('/v1/',  verifyToken, NotificationController.getNotifications)
router.post('/v1/', NotificationController.addNotification)

module.exports = router
