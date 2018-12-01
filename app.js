// Load Environment variables
require('dotenv').load();
let morgan = require('morgan');
let cors = require('cors');
const mongoose = require('mongoose');
let socket = require('socket.io');
var http = require('http');



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

    io.sockets.emit('notification', {title: 'An updated farm - Goat Farm Edo State 2010-2018 has just been created ...', date: '2018-12-01 12:00:00'});
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
app.get('/', function(req, res) {
res.send('<body><head><link href="favicon.ico" rel="shortcut icon" />\
    </head><body><h1>Awesome!</h1><p>Your server is set up. \
    Go ahead and configure your Paystack sample apps to make calls to: \
    <ul><li> <a href="#">https://'+req.headers.host+'</a></li></ul> \
    </p></body></html>');
});

app.get('/new-access-code', function(req, res) {
    var customerid = req.params.customerid;
    var cartid     = req.params.cartid;
    // you can then look up customer and cart details in a db etc
    // I'm hardcoding an email here for simplicity
    amountinkobo = process.env.TEST_AMOUNT * 100;
    if(isNaN(amountinkobo) || (amountinkobo < 2500)){
        amountinkobo = 2500;
    }
    email = process.env.SAMPLE_EMAIL;
    // all fields supported by this call can be gleaned from
    // https://developers.paystack.co/reference#initialize-a-transaction
    paystack.transaction.initialize({
        email:     email,        // a valid email address
        amount:    amountinkobo, // only kobo and must be integer
        metadata:  {
            custom_fields:[
                {
                    "display_name":"Started From",
                    "variable_name":"started_from",
                    "value":"sample charge card backend"
                },
                {
                    "display_name":"Requested by",
                    "variable_name":"requested_by",
                    "value": req.headers['user-agent']
                },
                {
                    "display_name":"Server",
                    "variable_name":"server",
                    "value": req.headers.host
                }
            ]
        }
    },function(error, body) {
        if(error){
            res.send({error:error});
            return;
        }
        res.send(body.data.access_code);
    });
});

app.get('/verify/:reference', function(req, res) {
    var reference = req.params.reference;

    paystack.transaction.verify(reference,
        function(error, body) {
        if(error){
            res.send({error:error});
            return;
        }
        if(body.data.success){
            // save authorization
            var auth = body.authorization;
        }
        res.send(body.data.gateway_response);
    });
});

//The 404 Route (ALWAYS Keep this as the last route)
// app.get('/*', function(req, res){
//     res.status(404).send('Only GET /new-access-code \
//         or GET /verify/{reference} is allowed');
// });
