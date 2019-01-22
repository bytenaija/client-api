let Profile = require('../models/Profile');
const {
    verify
} = require('../config/jwt')

let User = require('../models/User');
let config  = require('../config/cloudinary').cloudinary;
let cloudinary = require('cloudinary')
let formidable =  require('formidable')

/*configure our cloudinary*/
cloudinary.config({
    cloud_name: config.cloud_name, 
    api_key: config.api_key, 
    api_secret: config.api_secret 
});



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
            var form = new formidable.IncomingForm(),
            files = [],
            fields = [];
            form.on('field', function(field, value) {
                fields.push([field, value]);
            })
            form.on('file', function(field, file) {
                
                files.push([field, file]);
            })
            form.on('end', async function() {
                // console.log('done');
                // console.log(files, "files")
                
            let upload_len = files.length, upload_res = new Array();
            let multipleUpload = new Promise(async (resolve, reject) => {
                // console.log("Here")
            
                
                for(let i = 0; i < upload_len ; i++)
                {
                    
                    let filePath = files[i][1];
                   
                   await cloudinary.v2.uploader.upload(filePath.path, (error, result) => {
                    if(error) {
                        console.log(error)
                        reject(error)
                      }else{
                          upload_res.push(result.secure_url);
                        
                      }
    
    
        
                    })
        
                } 
    
                resolve(upload_res)
            })
    
            console.log(fields)
            let upload = await multipleUpload; 
            profile = {}
            fields.forEach(field =>{
                profile[field[0]] = field[1]
                
            })
            let profilePic = upload[0];
            profile.profilePic = profilePic;
            profile.user = sender
           
          
    
            Profile.create(profile).then(profile =>{
                User.findById(sender).then(user =>{
                    user.profile = profile._id;
                    user.save();
                    res.status(200).json({
                        success: true,
                        profile
                    })
                })
                
                    res.json({success: true, profile})
               
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    message: 'An error occured. Please try again later.'
                })
            })
    
            });
            form.parse(req);
    
         
       
                      
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
       
        try{

            let sender = extractuserId(req, res, next);
            if (sender) { 
            var form = new formidable.IncomingForm(),
            files = [],
            fields = [];
            form.on('field', function(field, value) {
                fields.push([field, value]);
            })
            form.on('file', function(field, file) {
                
                files.push([field, file]);
            })
            form.on('end', async function() {
                // console.log('done');
                // console.log(files, "files")
                
            let upload_len = files.length, upload_res = new Array();
            let multipleUpload = new Promise(async (resolve, reject) => {
                // console.log("Here")
            
                
                for(let i = 0; i < upload_len ; i++)
                {
                    
                    let filePath = files[i][1];
                   
                   await cloudinary.v2.uploader.upload(filePath.path, (error, result) => {
                    if(error) {
                        console.log(error)
                        reject(error)
                      }else{
                          upload_res.push(result.secure_url);
                        
                      }
    
    
        
                    })
        
                } 
    
                resolve(upload_res)
            })
    
            console.log(fields)
            let upload = await multipleUpload; 
            profile = {}
            fields.forEach(field =>{
                profile[field[0]] = field[1]
                
            })
            let profilePic = upload[0];
            profile.profilePic = profilePic;
            profile.user = sender
           
          
    
            Profile.findByIdAndUpdate(req.params.id, profile).then(profile => {

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
    
            });
            form.parse(req);
    
         
       
                      
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
}

const extractuserId = (req, res, next) => {
    let verification = verify(req, res, next);
    if (verification) {
        return verification.user._id;

    } else {
        return null;
    }
}

