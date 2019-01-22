let Profile = require('../models/Profile');
const {
    verify
} = require('../config/jwt')

let User = require('../models/User');


module.exports = {
    getProfile: (req, res, next) => {
        let sender = extractuserId(req, res, next);
        if (sender) {
           
                Profile.findOne({_id: sender}).then(profile => {
                 
                    res.status(200).json({
                        success: true,
                        profile
                    })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({
                        success: false,
                        message: 'An error occured. Please try again later.'
                    })
                })
         
            
        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated.'
            })
        }

    },
    addProfile: (req, res, next) => {
        try{
        let sender = extractuserId(req, res, next);
        if (sender) {        
                        req.body.user = sender;
                        Profile.create(req.body).then(profile => {
                            User.findById(sender).then(user =>{
                                user.profile = profile._id;
                                user.save();
                                res.status(200).json({
                                    success: true,
                                    profile
                                })
                            })
                           
                        }).catch(err => {
                            console.log(err)
                            res.status(500).json({
                                success: false,
                                message: 'An error occured. Please try again later.'
                            })
                        })
                 


        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated.'
            })
        }
    }catch(err){
        res.status(500).json({
            success: false,
            message: 'An error occured. Please try again later.'
        })
    }
    },
    editProfile: (req, res, next) => {
        let sender = extractuserId(req, res, next);
        if (sender) {
            Profile.findByIdAndUpdate(req.params.id, req.body).then(profile => {

                res.status(200).json({
                    success: true,
                    profile
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    message: 'An error occured. Please try again later.'
                })
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated.'
            })
        }
    },
}

const extractuserId = (req, res, next) => {
    let verification = verify(req, res, next);
    if (verification) {
        return verification.user._id;

    } else {
        return null;
    }
}

