let Address = require('../models/Address');
let User = require('../models/User');
let {verify} = require('../config/jwt')


module.exports = {
    createAddress: (req, res, next)=>{
        let verification = verify(req, res, next);
        if(verification){
          
            req.body.userId = verification.user._id;
            
          
            Address.create(req.body)
            .then(address =>{
                if(address){
                  
                    User.findOne({_id: verification.user._id}).then(user =>{
                        if(user){
                            user.addresses.push(address._id);
                            user.save()
                            res.status(200).json({success: true, message: 'Address created Successful', address});
                        }else{
                            res.status(500).json({success: false, message: 'Address not created Successful'});
                        }
                  
                    })
                    
                }else{
                    res.status(500).json({success: false, message: 'Address could not be created. Try again please'});
                }
                }).catch(err =>{
                    
                    res.status(500).json({success: false, message: 'Address could not be created. Try again please'});
                })
        }else{
            res.status(401).json({success: false, message: 'User must be authenticated'});
        }


    },

    getAllAddress: (req, res, next)=>{
        let verification = verify(req, res, next);
       
        if(verification){
            Address.find({
               userId: verification.user._id 
            }).populate('userId').then(addresses =>{
                if(addresses){
                    res.status(200).json({success: true, addresses});
                }else{
                    res.status(200).json({success: false, message: `Could not get all addresses`}); 
                }
            }).catch(err =>{
                console.error(err);
                res.status(200).json({success: false, message: `Could not get all addresses`}); 
            })
        }else{
            res.status(401).json({success: false, message: 'User must be authenticated'});
        }
      
    },

    getAddress: (req, res)=>{
        Address.findById(req.params.id)
        .then(address => { if(address){
            res.status(200).json({success: true, address});
        }else{
            res.status(200).json({success: false, message: `Could not get that address`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not get that address`}); 
    })
    },

    editAddress: (req, res)=>{
        Address.findByIdAndUpdate(req.params.id, req.body)
        .then(address => { if(address){
           
            res.status(200).json({success: true, message: "Successfully updated address"});
        }else{
            res.status(200).json({success: false, message: `Could not update address. Please try again`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not update address. Please try again`}); 
    })
    },

    delete: (req, res)=>{
        Address.findByIdAndRemove(req.params.id)
        .then(address => { if(address){
            res.status(200).json({success: true, message: "Successfully deleted address"});
        }else{
            res.status(200).json({success: false, message: `Could not delete address. Please try again`}); 
        }
    }).catch(err =>{
        console.error(err);
        res.status(200).json({success: false, message: `Could not delete address. Please try again`}); 
    })
    }
            
}