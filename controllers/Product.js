let Product = require('../models/Product');
let ProductImage = require('../models/ProductImage');
let config  = require('../config/cloudinary').cloudinary;
let cloudinary = require('cloudinary')
let formidable =  require('formidable')
var winston = require('../config/winston');

/*configure our cloudinary*/
cloudinary.config({
    cloud_name: config.cloud_name, 
    api_key: config.api_key, 
    api_secret: config.api_secret 
});

module.exports = {
    addProduct: async (req, res, next) =>{

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
               
               await cloudinary.v2.uploader.upload(filePath.path, (err, result) => {
                if(err) {
                    winston.error(err)
                    reject(err)
                  }else{
                      upload_res.push(result.secure_url);
                    //   console.log(upload_res)
                    //   console.log(result)
                  }


    
                })
    
            } 

            resolve(upload_res)
        })

        console.log(fields)
        let upload = await multipleUpload; 
        let imageIds = [],
        product = {}
        fields.forEach(field =>{
            product[field[0]] = field[1]
            
        })
        upload.forEach(productImage => {
                ProductImage.create({imageurl: productImage}).then(pIm =>{
                    imageIds.push(pIm._id)
                })
            });
       
        /*waits until promise is resolved before sending back response to user*/

        Product.create(product).then(product =>{
            product.update({images: imageIds}).then(product=>{
                console.log(product);
                res.json(product)
            }).catch(err =>{
                winston.error(err)
            })
        })

        });
        form.parse(req);

        // console.log("Bodyushuhsuhsuhsuhdsu", req)
        // let {stock, name, price, decision} = req.fields
       
       
        
    },

    deleteProduct: (req, res, next) =>{
        let {id} = req.params;
        Product.findById({id})
        .then(product =>{
            product
            .remove()
            .exec()
            .then(product => 
             res.status(200).json({success: true, message: 'Successfully deleted product'})
            )
        })
        .catch(err =>{
            return res.status(500).json({success: false, message: 'An err occured. Please try again later'})
        })
    },

    editProduct: (req, res, next) =>{

    },

    getProducts: (req, res, next) =>{
        Product.find({})
        .populate('images')
        .exec()
        .then(products =>{
            res.status(200).json({success: true, products})
        })
        .catch(err =>{
            winston.error(err)
            return res.status(500).json({success: false, message: 'An err occured. Please try again later'})
        })
    },

    getProduct: (req, res, next) =>{
        Product.findById(req.params.id)
        .populate('images')
        .exec()
        .then(product =>{
            res.status(200).json({success: true, product})
        })
        .catch(err =>{
            winston.error(err)
            return res.status(500).json({success: false, message: 'An err occured. Please try again later'})
        })
    },
}