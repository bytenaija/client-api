let Transaction = require('../models/Transaction')
let {verify} = require('../config/jwt')
var winston = require('../config/winston');

module.exports = {
    getTransactions: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
           // console.log(verification)
            Transaction.find({email: verification.user.email}).then(transactions =>{
                res.status(200).json({success: true, transactions});
            }).catch(err =>{
                winston.error(err)
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    getTransaction: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
            Transaction.find({email: verification.email, _id: req.params.id}).then(transaction =>{
                res.status(200).json({success: true, transaction});
            }).catch(err =>{
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    updateTransaction: (req, res) => {

    },
    deleteTransaction: (req, res) => {

    }
}