let Feed = require('../models/Feeds');
let FeedImage = require('../models/FeedImage');
let config = require('../config/cloudinary').cloudinary;
let cloudinary = require('cloudinary')
let formidable = require('formidable')
const {
    verify
} = require('../config/jwt')

/*configure our cloudinary*/
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

module.exports = {
    addFeed: async (req, res, next) => {

        var form = new formidable.IncomingForm(),
            files = [],
            fields = [];
        form.on('field', function (field, value) {
            fields.push([field, value]);
        })
        form.on('file', function (field, file) {

            files.push([field, file]);
        })
        form.on('end', async function () {
            // console.log('done');
            console.log(files, "files")

            let upload_len = files.length,
                upload_res = new Array();
            let multipleUpload = new Promise(async (resolve, reject) => {
                // console.log("Here")


                for (let i = 0; i < upload_len; i++) {

                    let filePath = files[i][1];

                    await cloudinary.v2.uploader.upload(filePath.path, (error, result) => {
                        if (error) {
                            console.log(error)
                            reject(error)
                        } else {
                            upload_res.push(result.secure_url);
                            //   console.log(upload_res)
                            //   console.log(result)
                        }



                    })

                }

                resolve(upload_res)
            })

            
            let upload = await multipleUpload;
            let imageIds = {},
                feed = {}
            fields.forEach(field => {
                feed[field[0]] = field[1]

            })
            upload.forEach(feedImage => {
                FeedImage.create({
                    imageurl: feedImage
                }).then(pIm => {
                    imageIds = pIm._id;
                })
            });

            /*waits until promise is resolved before sending back feeds to user*/

            Feed.create(feed).then(feed => {
                feed.update({
                    image: imageIds
                }).then(feed => {
                    Feed.find({}).populate('image').then(feeds => {
                        res.status(200).json({
                            success: true,
                            feeds
                        })
                    })

                }).catch(err => {
                    console.log(err)
                })
            })

        });
        form.parse(req);
    },

    getFeeds: (req, res, next) => {
        Feed.find({}).populate('image').then(feeds => {
            console.log(feeds)
            res.status(200).json({
                success: true,
                feeds
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again later.'
            })
        })
    },

    editFeed: (req, res, next) => {
        let {
            type
        } = req.query;
        if (type == 'dislike') {
           dislikeFeed(req.params.id, extractuserId(req, res, next)).then(feeds =>{
            console.log("ffeeeedd", feeds);
            if (feeds) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully dislike feed',
                    feeds
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Could not dislike feed'
                })
            }
           })
           
        } else if (type == 'like') {
            let feeds = likeFeed(req.params.id, extractuserId(req, res, next)).then(feeds =>{
                console.log("ffeeeedd", feeds);
                if (feeds) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully like feed',
                    feeds
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Could not like feed'
                })
            }
        })
        }
        if (type == 'unfavourite') {
            let feeds = unFavouriteFeed(req.params.id, extractuserId(req, res, next)).then(feeds =>{
            console.log("ffeeeedd", feeds);
            if (feeds) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully unfavourite feed',
                    feeds
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Could not unfavourite feed'
                })
            }
        })
        }
        if (type == 'favourite') {
            let feeds = favouriteFeed(req.params.id, extractuserId(req, res, next)).then(feeds =>{
            console.log("ffeeeedd", feeds);
            if (feeds) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully favourite feed',
                    feeds
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Could not favourite feed'
                })
            }
        })
        }

    },

}

const unFavouriteFeed = (id, user) => {
    return new Promise((resolve, reject) =>{
        Feed.findById(id).then(feed => {
            feed.favourites -= 1;
            let fav = feed.favouritedBy.filter(favourite => favourite.toString() !== user.toString())
            feed.favouritedBy = fav;
            feed.save()
            Feed.find({}).populate('image').then(feeds => {
                resolve(feeds)
            })
        }).catch(err => {
            console.log(err);
            reject(false);
        })
    })
   
}

const favouriteFeed = (id, user) => {
    return new Promise((resolve, reject) =>{
    Feed.findById(id).then(feed => {
        feed.favourites += 1;
        feed.favouritedBy.push(user);
        feed.save()
        Feed.find({}).populate('image').then(feeds => {
            resolve(feeds)
        })
    })

    .catch(err => {
        console.log(err);
        reject(false);
    })
})
}

const dislikeFeed = (id, user) => {
    return new Promise((resolve, reject) =>{
    Feed.findById(id).then(feed => {
        feed.likes -= 1;
        feed.dislikedBy.push(user);
        feed.dislikes += 1;
        let fav = feed.likedBy.filter(favourite => {
            console.log("favourite", favourite, user)
            favourite.toString() !== user.toString()
        })
        console.log("liked fav in disliked", fav)
        feed.liked = fav;
        feed.save();
        Feed.find({}).populate('image').then(feeds => {
                resolve(feeds)
            }

        )
       
    }).catch(err => {
        console.log(err);
        reject(false);
    })
})
}

const likeFeed = (id, user) => {
    return new Promise((resolve, reject) =>{
    Feed.findById(id).then(feed => {
        feed.likes += 1;
        feed.likedBy.push(user);
        feed.dislikes -= 1;
        let fav = feed.dislikedBy.filter(favourite => favourite.toString() !== user.toString())
        console.log("dislined fav in liked", fav)
        feed.dislikedBy = fav;
        feed.save();
        Feed.find({}).populate('image').then(feeds => {
            resolve(feeds)
        })
  
    }).catch(err => {
        console.log(err);
        reject(false);
    })
})
}

const extractuserId = (req, res, next) => {
    let verification = verify(req, res, next);
    if (verification) {
        return verification.user._id;

    } else {
        return null;
    }
}