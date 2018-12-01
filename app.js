// Load Environment variables
require('dotenv').load();
let morgan = require('morgan');
let cors = require('cors');
const mongoose = require('mongoose');
let socket = require('socket.io');
var http = require('http');
const connectedSockets = []



// let adminRoute = require('./routes/admin/auth.js')
// let adminRoute = require('./routes/admin/auth.js')
var paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// uuid module is required to create a random reference number
var uuid     = require('node-uuid');
mongoose.connect('mongodb://root:rootUser1@ds123224.mlab.com:23224/goatti', (err, connect)=>{
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


io.sockets.on('connection', (socket) =>{

    console.log("Socket Connected")
    socket.on('id', (id)=>{
        connectedSockets.push({id, socket});
        console.log(connectedSockets)
    })

    io.sockets.on('disconnect', (socket)=>{
        connectedSockets = connectedSockets.filter(element => element.socket !== socket)
        console.log("Socket Disconnected")
        console.log(connectedSockets)
    })
});


app.use(function(req, res, next) {
    req.io = io;
    next();
});

let adminRoutes = require('./routes/admin/auth');
let userManagementRoutes = require('./routes/admin/user');
let authRoutes = require('./routes/auth');
let farmRoutes = require('./routes/farm');

app.use('/api/admin/auth', adminRoutes);
app.use('/api/admin/users', userManagementRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);

