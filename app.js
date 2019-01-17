// Load Environment variables
require('dotenv').load();
let morgan = require('morgan');
let cors = require('cors');
const mongoose = require('mongoose');
let socket = require('socket.io');
var http = require('http');
let fs = require('fs')

var redis = require('redis');
var ioredis = require('socket.io-redis'); //Adapter
var url = require('url'); 
const REDIS_URL =  process.env.REDIS_URL || 'redis://h:p8e15aeba426fb276116439f8d2c91f30d4bf9fafa7bb6874e7a572fc9dd5d96b@ec2-52-5-188-199.compute-1.amazonaws.com:18599'
// var redisURL = url.parse(REDIS_URL);

const redisClient = redis.createClient({url: REDIS_URL});

console.dir(redisClient)

const clients = new Set();

// let adminRoute = require('./routes/admin/auth.js')
// let adminRoute = require('./routes/admin/auth.js')


// uuid module is required to create a random reference number

mongoose.connect('mongodb://root:rootUser1@ds123224.mlab.com:23224/goatti', { useNewUrlParser: true }, (err, connect)=>{
  if(err) throw err
  console.log("Connected to MongoDB");
});


var express =  require('express');
var app = require('express')();
app = module.exports.app = express();
app.use(cors());
app.use(morgan('dev'));


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

let io = socket.listen(server);

io.configure = () =>{
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
};

// var pub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
// var sub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
// pub.auth(redisURL.auth.split(":")[1]);
// sub.auth(redisURL.auth.split(":")[1]);

// console.log(redisURL)

// var redisOptions = {
//   pubClient: pub,
//   subClient: sub,
//   host: redisURL.hostname,
//   port: redisURL.port
// };

// io.adapter(ioredis(redisOptions));

io.on('connection', (socket) =>{
    
        socket.on('storeClientInfo', function (data) {

            var clientInfo = new Object();
            clientInfo.userId         = data.userId;
            clientInfo.clientId     = socket.id;
            clients.add(clientInfo);

            console.log("Clientsssssssssssss", clients)

            console.log("iooooooooooooooooooooooooooo", io)
           redisClient.set(data.userId, socket.id);
        });

        socket.on('disconnect', async (data) => {
            for (let element of clients.entries()){
                console.log("elelelelelelelele", element)
                if(element.clientId == socket.id){
                    clients.delete(element)

                   await redisClient.del(element.userId)
                    break;

                }
                
            }
            
            
        });
   
});


app.use(function(req, res, next) {
    req.io = io;
    req.redisClient = redisClient;
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


app.use('/api/admin/auth', adminRoutes);
app.use('/api/admin/users', userManagementRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/investments', investmentRoutes);

