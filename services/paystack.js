const axios = require('axios')

module.exports = {

    sendOTP: (reference, OTP)=>{
        return new Promise((resolve, reject) => {

        let paymentDetails = {
            reference,
            otp: OTP
        }

        axios.post(`https://api.paystack.co/charge/submit_otp`, transaction)
                .then(chargeResponse => {
                   console.log("Charge response", chargeResponse.data)
                        
                    if (chargeResponse.data.status == 'success') {
                        resolve(true)
                    }else{
                        resolve(false);
                    }
    })
})
},
    payment: (number, cvv, expiry_month, expiry_year, pin, amount, email, reference) => {
       // console.log("email", email)
        return new Promise((resolve, reject) => {

            // axios.defaults.headers.post['Authorization'] = 'Bearer sk_test_dce12f10f109e0a79d04e8f1615610e9d89c240e';
            axios.defaults.headers.post['Authorization'] = 'Bearer sk_live_9210a883f7a1124638b18304c664ab71d4586e02';
            

            const card = {
                number,
                cvv,
                expiry_month,
                expiry_year,
                
            }

            const transaction = {
                email,
                amount: 20,//amount * 100,
                reference,
                card
            }

            //console.log(transaction)

            axios.post(`https://api.paystack.co/charge`, transaction)
                .then( async chargeResponse => {
                   console.log("Charge response", chargeResponse.data)

                    if (chargeResponse.data.status == 'send_pin') {
                      let response =  await submitPin(pin, chargeResponse.data.reference)
                      console.log("Optdddddddddddddddddddddddd", response, chargeResponse.data.reference, response.display_text);
                      if(response.status == 'send_otp'){
                          reject({status: 'send_otp', reference: chargeResponse.data.reference, displayText: response.display_text})
                      }
                      console.log(response);
                    }else{
                        reject(false)
                    }
                }).catch(err => {
                    console.log("Payment Error data", err.response.data)
                    console.log("Payment Error response", err.response.data.data.message)
                    reject(err.response.data.data.message)
                })


        })

    },

    
}

const submitPin = (pin, reference) =>{
    let url = 'https://api.paystack.co/charge/submit_pin'
    let paymentDetails = {
        pin,
        reference
    }

    axios.post(url, paymentDetails)
    .then(chargeResponse => {
       console.log("Charge response from from OTP", chargeResponse.data)

        if (chargeResponse.status) {
         return chargeResponse.data
        }else{
            return false;
        }
    }).catch(err => {
        console.log("Payment Error data", err.response.data)
        console.log("Payment Error response", err.response.data.data.message)
        return err.response.data.data.message
    })

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