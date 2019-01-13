let express = require('express')
const router = express.Router();
const InvestmentController = require('../controllers/Investment')
let {verifyToken} = require('../config/jwt')

router.post('/v1/', verifyToken, InvestmentController.createInvestment)
router.get('/v1/',  verifyToken, InvestmentController.getInvestments)
router.get('/v1/:id',  verifyToken, InvestmentController.getInvestment)
router.patch('/v1/:id', verifyToken, InvestmentController.updateInvestment)
router.delete('/v1/:id', verifyToken, InvestmentController.deleteInvestment)

module.exports = router
