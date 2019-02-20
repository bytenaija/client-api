let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')
const InquiryController = require('../controllers/Inquiry')



router.get('/v1/', verifyToken, InquiryController.getInquiries)
router.post('/v1/', verifyToken, InquiryController.addInquiry)
router.patch('/v1/:id', verifyToken, InquiryController.editInquiry)



module.exports = router
