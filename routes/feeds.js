let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const FeedController = require('../controllers/Feeds')



router.get('/v1/', FeedController.getFeeds)
router.post('/v1/', verifyToken, FeedController.addFeed)
router.patch('/v1/:id', verifyToken, FeedController.editFeed)



module.exports = router
