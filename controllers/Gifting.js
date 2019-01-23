let Gifting = require('../models/Gifting');
const {
    verify
} = require('../config/jwt')

let User = require('../models/User');

module.exports = {
    getGiftings: (req, res, next) => {
        let sender = extractuserId(req, res, next);
        if (sender) {
            Gifting.find({}).then(gifts => {
                res.status(200).json({
                    success: true,
                    gifts
                })
            }).catch(err => {
                console.log(err)
                res.status(442).json({
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
    addGifting: (req, res, next) => {
        try{
        let sender = extractuserId(req, res, next);
        if (sender) {

            User.findById(sender).populate('farms').then(user => {

                if (user) {
                   // console.log("Ususususu", user)
                    let totalNumberOfGoats = getNumberOfGoats(user.farms);
                    if (totalNumberOfGoats > req.body.number) {
                                              //sort user.farms
                        user.farms.sort((a, b) => a.numberOfGoats - b.numberOfGoats);
                       
                        let numberToSend = req.body.number;
                        let numberRemaining = numberToSend;
                        //if number reduced is > than number needed reduce it by number needed and save
                        
                      for(farm of user.farms){
                            if(farm.numberOfGoats > numberToSend){
                                let amount = numberToSend * 50000;
                                farm.numberOfGoats -= numberToSend;
                                farm.amountInvested -= amount;
                                farm.save()
                                success = true;
                               break;  
                            }else{
                                 //go through each and reduce the number by half
                                 if(numberRemaining > 0){
                                    let half = farm.numberOfGoats / 2;
                                    if(numberRemaining >= half){
                                        let amount = half * 50000;
                                        farm.numberOfGoats -= half;
                                        farm.amountInvested -= amount;
                                        numberRemaining -=  half;
                                        farm.save();
                                    }else{
                                        let amount = numberRemaining * 50000;
                                        farm.numberOfGoats -= numberRemaining;
                                        farm.amountInvested -= amount;
                                        numberRemaining -=  numberRemaining;
                                        farm.save();
                                    }
                                    
                                 }


                            }
                        }
                       
                        req.body.sender = sender;
                        Gifting.create(req.body).then(gift => {
                            user.gifts.push(gift._id);
                            user.save();
                            res.status(200).json({
                                success: true,
                                gift
                            })
                        }).catch(err => {
                            console.log(err)
                            res.status(442).json({
                                success: false,
                                message: 'An error occured. Please try again later.'
                            })
                        })
                    }else{
                        res.status(442).json({
                            success: false,
                            message: 'You do not have sufficient investment to gift.'
                        })
                    }

                }

            })

        } else {
            res.status(401).json({
                success: false,
                message: 'User must be authenticated.'
            })
        }
    }catch(err){
        res.status(442).json({
            success: false,
            message: 'An error occured. Please try again later.'
        })
    }
    },
    editGifting: (req, res, next) => {
        let sender = extractuserId(req, res, next);
        if (sender) {
            Gifting.findByIdAndUpdate(req.params.id, req.body).then(gift => {

                res.status(200).json({
                    success: true,
                    gift
                })
            }).catch(err => {
                console.log(err)
                res.status(442).json({
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
    cancelGifting: (req, res, next) => {
        let sender = extractuserId(req, res, next);
        if (sender) {
            Gifting.findByIdAndDelete(req.params.id).then(gift => {

                res.status(200).json({
                    success: true,
                    message: 'Gifting Successfully canceled'
                })
            }).catch(err => {
                console.log(err)
                res.status(442).json({
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

getNumberOfGoats = (farms) => {
    if (farms.length == 0) {
        return 0;
    } else {
        let number = farms.reduce((numberOfGoats, farm) => {
            return numberOfGoats + farm.numberOfGoats
        }, 0)

        return number;
    }


}