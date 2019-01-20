let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const GiftingController = require('../controllers/Gifting')



router.get('/v1/', GiftingController.getGiftings)
router.post('/v1/', verifyToken, GiftingController.addGifting)
router.patch('/v1/:id', verifyToken, GiftingController.editGifting)
router.delete('/v1/:id', verifyToken, GiftingController.cancelGifting)



module.exports = router
