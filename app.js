// Load Environment variables
require('dotenv').load();
let morgan = require('morgan');
let cors = require('cors');
const mongoose = require('mongoose');
let socket = require('socket.io');
var http = require('http');
let fs = require('fs')
var winston = require('./config/winston');
var redis = require('redis');
var ioredis = require('socket.io-redis'); //Adapter
var url = require('url');
const REDIS_URL = process.env.NODE_ENV == 'production'? process.env.REDIS_URL : 'redis://h:p8e15aeba426fb276116439f8d2c91f30d4bf9fafa7bb6874e7a572fc9dd5d96b@ec2-52-5-188-199.compute-1.amazonaws.com:18599'
// var redisURL = url.parse(REDIS_URL);
var kue = require('kue')
 , queue = kue.createQueue({
    redis: REDIS_URL
  });
const redisClient = redis.createClient({
    url: REDIS_URL
});

console = winston;

const clients = new Set();

// let adminRoute = require('./routes/admin/auth.js')
// let adminRoute = require('./routes/admin/auth.js')


// uuid module is required to create a random reference number
// 'mongodb://root:rootUser1@ds123224.mlab.com:23224/goatti'

mongoose.connect('mongodb://goatti:goattiproductionpassword1@localhost:27017/goatti', {
    useNewUrlParser: true
}, (err, connect) => {
    if (err){
        winston.info(err)
        throw err
    } 
    winston.info("Connected to MongoDB");
});


var express = require('express');
var app = require('express')();
app = module.exports.app = express();
app.use(cors());
app.use(morgan('combined', { stream: winston.stream }));


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    winston.info("Node app is running at localhost:" + app.get('port'))
});

let io = socket.listen(server);

io.configure = () => {
    io.set("transports", ["xhr-polling"])
    io.set("polling duration", 10)
};



io.on('connection', (socket) => {

    socket.on('storeClientInfo', function (data) {

        clients.add({
            userId: data.userId,
            clientId: socket.id
        });

        redisClient.set(data.userId, socket.id);

    });

    socket.on('disconnect', async (data) => {
        for (let element of clients.entries()) {
         
           
            if (element[0].clientId == socket.id) {

               
              
                redisClient.del(element[0].userId, (err, result) => {
                    if (err) {
                       
                    } else {
                     
                    }

                })
                clients.delete(element)
             

            }

        }


    });

});


app.use(function (req, res, next) {
    req.io = io;
    req.redisClient = redisClient;
    req.queue = queue;
    next();
});

let adminRoutes = require('./routes/admin/auth');
let userManagementRoutes = require('./routes/admin/user');
let authRoutes = require('./routes/auth');
let farmRoutes = require('./routes/farm');
let addressRoutes = require('./routes/address');
let productRoutes = require('./routes/product');
let orderRoutes = require('./routes/orders');
let transactionRoutes = require('./routes/transactions');
let notificationRoutes = require('./routes/notifications');
let investmentRoutes = require('./routes/investment');
let SavedItemRoutes = require('./routes/SavedItem');
let feedRoutes = require('./routes/feeds');
let giftRoutes = require('./routes/gifting');
let inquiryRoutes = require('./routes/inquiry');
let profileRoutes = require('./routes/profile');


app.use('/admin/auth', adminRoutes);
app.use('/admin/users', userManagementRoutes)
app.use('/auth', authRoutes);
app.use('/farms', farmRoutes);
app.use('/addresses', addressRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/transactions', transactionRoutes);
app.use('/notifications', notificationRoutes);
app.use('/investments', investmentRoutes);
app.use('/saveditems', SavedItemRoutes);
app.use('/feeds', feedRoutes);
app.use('/gifts', giftRoutes);
app.use('/inquiries', inquiryRoutes);
app.use('/profile', profileRoutes);

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  });