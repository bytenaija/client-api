let Investment = require('../models/Investment')
let {verify} = require('../config/jwt')
var winston = require('../config/winston');

module.exports = {

    createInvestment: (req, res, next) =>{
        let verification = verify(req, res, next);
        if(verification){
            Investment.create(req.body).then(investments =>{
                if(investments){

                    res.status(200).json({success: true, investments})
                }else{
                    res.status(200).json({success: false, message: 'An error occured. Please try again later'})
                }
            }).catch(err =>{
                winston.error(err)
                res.status(200).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }
    },
    getInvestments: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
       
            Investment.find({}).then(investments =>{
                res.status(200).json({success: true, investments});
            }).catch(err =>{
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    getInvestment: (req, res, next) => {
        let verification = verify(req, res, next);
        if(verification){
            Investment.find({_id: req.params.id}).then(investment =>{
                res.status(200).json({success: true, investment});
            }).catch(err =>{
                return res.status(500).json({success: false, message: 'An error occured. Please try again later'})
            })
        }else{
            res.status(401).json({success: false, message: 'Authentication Required'});
        }

    },
    updateInvestment: (req, res) => {

    },
    deleteInvestment: (req, res) => {

    }
}