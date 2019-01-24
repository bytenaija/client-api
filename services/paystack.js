const axios = require('axios')

module.exports = {
    payment: (number, cvv, expiry_month, expiry_year, amount, email, reference) => {
       // console.log("email", email)
        return new Promise((resolve, reject) => {

            // axios.defaults.headers.post['Authorization'] = 'Bearer sk_test_dce12f10f109e0a79d04e8f1615610e9d89c240e';
            axios.defaults.headers.post['Authorization'] = 'Bearer sk_live_9210a883f7a1124638b18304c664ab71d4586e02';
            

            const card = {
                number,
                cvv,
                expiry_month,
                expiry_year
            }

            const transaction = {
                email,
                amount: amount * 100,
                reference,
                card
            }

            //console.log(transaction)

            axios.post(`https://api.paystack.co/charge`, transaction)
                .then(chargeResponse => {
                   console.log("Charge response", chargeResponse.data)

                    if (chargeResponse.data.status) {
                        resolve(chargeResponse)
                    }else{
                        reject(false)
                    }
                }).catch(err => {
                    console.log("Payment Error data", err.response.data)
                    console.log("Payment Error response", err.response.data.data.message)
                    reject(err.response.data.data.message)
                })


        })

    }
}
// module.exports = {
// getNewAccessCode: (req, res) =>{
//     var customerid = req.params.customerid;
//     var cartid     = req.params.cartid;
//     amountinkobo = process.env.TEST_AMOUNT * 100;
//     if(isNaN(amountinkobo) || (amountinkobo < 2500)){
//         amountinkobo = 2500;
//     }
//     email = process.env.SAMPLE_EMAIL;

//     paystack.transaction.initialize({
//         email:     email,        // a valid email address
//         amount:    amountinkobo, // only kobo and must be integer
//         metadata:  {
//             custom_fields:[
//                 {
//                     "display_name":"Started From",
//                     "variable_name":"started_from",
//                     "value":"sample charge card backend"
//                 },
//                 {
//                     "display_name":"Requested by",
//                     "variable_name":"requested_by",
//                     "value": req.headers['user-agent']
//                 },
//                 {
//                     "display_name":"Server",
//                     "variable_name":"server",
//                     "value": req.headers.host
//                 }
//             ]
//         }
//     },function(error, body) {
//         if(error){
//             res.send({error:error});
//             return;
//         }
//         res.send(body.data.access_code);
//     });
// },

// verifyReference: () =>{
//     var reference = req.params.reference;

//     paystack.transaction.verify(reference,
//         function(error, body) {
//         if(error){
//             res.send({error:error});
//             return;
//         }
//         if(body.data.success){
//             // save authorization
//             var auth = body.authorization;
//         }
//         res.send(body.data.gateway_response);
//     });
// }
// }