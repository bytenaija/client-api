let SavedItem = require('../models/SavedItem');
let uuid = require('node-uuid');
let {
    verify
} = require('../config/jwt')
let moment = require('moment')

module.exports = {
    saveItem: (req, res, next) => {
        let verification = verify(req, res, next);
        if (verification) {
            let {
                product
            } = req.body;
            let user = verification.user._id;
            SavedItem.create({
                    user,
                    product
                })
                .then(savedItem => {
                    if (savedItem) {
                        SavedItem.findById(savedItem._id)
                    .populate({
                        path: 'product',
                        populate: {
                            path: 'images',
                            model: 'ProductImage',
                        }
                    }).then(savedItem => {
                        res.status(200).json({
                            success: true,
                            message: 'SavedItem Placed Successful',
                            savedItem
                        });
                    })

                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'SavedItem could not be processed. Try again please'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: 'SavedItem could not be processed. Try again please'
                    });
                })
        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            });
        }


    },


    getSavedItems: (req, res, next) => {
        let verification = verify(req, res, next);
        if (verification) {
            SavedItem.find({
                user: verification.user._id
            }).populate({
                path: 'product',
                populate: {
                    path: 'images',
                    model: 'ProductImage',
                }
            }).then(savedItems => {
                if (savedItems) {
                    console.log(savedItems)
                    res.status(200).json({
                        success: true,
                        savedItems
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        message: `Could not get all savedItems`
                    });
                }
            }).catch(err => {
                console.error(err);
                res.status(200).json({
                    success: false,
                    message: `Could not get all savedItems`
                });
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            });
        }

    },




    editSavedItem: (req, res) => {
        SavedItem.findByIdAndUpdate(req.params.id, req.body)
            .then(savedItem => {
                res.status(200).json({
                    success: true,
                    message: "Successfully updated savedItem"
                });

            }).catch(err => {
                console.error(err);
                res.status(200).json({
                    success: false,
                    message: `Could not update savedItem. Please try again`
                });
            })
    },

    deleteSavedItem: (req, res) => {
        let verification = verify(req, res, next);
        if (verification) {
        SavedItem.findOneAndDelete({product: req.params.id, user: verification.user._id})
            .then(savedItem => {
                if (savedItem) {
                    res.status(200).json({
                        success: true,
                        message: "Successfully deleted savedItem"
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        message: `Could not delete savedItem. Please try again`
                    });
                }
            }).catch(err => {
                console.error(err);
                res.status(200).json({
                    success: false,
                    message: `Could not delete savedItem. Please try again`
                });
            })
        }else{
            res.status(401).json({
                success: false,
                message: 'User must be authenticated'
            }); 
        }
    }

}