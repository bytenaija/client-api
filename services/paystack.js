
module.exports = {
getNewAccessCode: (req, res) =>{
    var customerid = req.params.customerid;
    var cartid     = req.params.cartid;
    amountinkobo = process.env.TEST_AMOUNT * 100;
    if(isNaN(amountinkobo) || (amountinkobo < 2500)){
        amountinkobo = 2500;
    }
    email = process.env.SAMPLE_EMAIL;

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
},

verifyReference: () =>{
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
}
}