let express = require('express')
const router = express.Router();
let {verifyToken} = require('../config/jwt')

const SavedItemController = require('../controllers/SavedItem')



// //orders operations
router.post('/v1', verifyToken, SavedItemController.saveItem)
router.get('/v1/', verifyToken, SavedItemController.getSavedItems)
router.put('/v1/:id', verifyToken, SavedItemController.editSavedItem)
router.delete('/v1/', verifyToken, SavedItemController.deleteSavedItem)



module.exports = router
