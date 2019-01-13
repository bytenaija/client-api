let express = require('express')
const router = express.Router();
const TransactionController = require('../controllers/Transaction')
let {verifyToken} = require('../config/jwt')


router.get('/v1/',  verifyToken, TransactionController.getTransactions)
router.get('/v1/:id',  verifyToken, TransactionController.getTransaction)
router.patch('/v1/:id', verifyToken, TransactionController.updateTransaction)
router.delete('/v1/:id', verifyToken, TransactionController.deleteTransaction)

module.exports = router
