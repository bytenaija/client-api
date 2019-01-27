const axios = require('axios')

module.exports = {

    sendOTP: (reference, OTP)=>{

        console.log("Sending OTP", reference, OTP);
        return new Promise((resolve, reject) => {

        let paymentDetails = {
            reference,
            otp: OTP
        }

        axios.interceptors.response.use((response) => {
            return response;
        }, function (error) {
            return Promise.reject(error.response);
        });

        axios.post(`https://api.paystack.co/charge/submit_otp`, paymentDetails)
                .then( async chargeResponse => {
                   console.log("Charge response from sending OTP", chargeResponse.data)
                        
                    if (chargeResponse.data.status == 'success') {
                        console.log('resolving true')
                        resolve(true)
                    }else if(chargeResponse.data.status == 'pending'){
                        let response;
                        setTimeout(async () =>{
                            response = await checkPending(reference)
                        }, 15000)
                    
                        if(response){
                            if(response.status != 'pending'){
                                if(response.status == 'failed'){
                                    reject(response.message);
                                }else{
                                    resolve(true)
                                }
                                
                            }
                        }
                        
                    }
    })
})
},
    payment: (number, cvv, expiry_month, expiry_year, pin, amount, email, reference) => {
       console.log("email", email)
        return new Promise((resolve, reject) => {

            axios.interceptors.response.use((response) => {
                return response;
            }, function (error) {
                console.log("Error in axios interceptors paystack 56", error.response.data)
                return Promise.reject(error.response.data);
            });
            // axios.defaults.headers.post['Authorization'] = 'Bearer sk_test_dce12f10f109e0a79d04e8f1615610e9d89c240e';
            axios.defaults.headers.post['Authorization'] = 'Bearer sk_live_9210a883f7a1124638b18304c664ab71d4586e02';
            

            const card = {
                number,
                cvv,
                expiry_month,
                expiry_year,
                pin
            }

            const transaction = {
                email,
                amount: 2,//amount * 100,
                reference,
                card,
                pin
            }

            //console.log(transaction)

            axios.post(`https://api.paystack.co/charge`, transaction)
                .then( async chargeResponse => {
                    let {data} = chargeResponse.data
                   console.log("Charge response data data", data)

                    if (data.status == 'send_pin') {
                    try{
                      let response =  await submitPin(pin, data.reference)
                      console.log("responsesssss", response)
                      console.log("Optdddddddddddddddddddddddd", response.data.display_text, data.reference);
                      if(response.data.status == 'send_otp'){
                          console.log("rejectiifififififii")
                          reject({status: 'send_otp', reference: data.reference, displayText: response.data.display_text})
                      }else{
                        console.log("BBBDBBDBDBDBDBDBDBDB");
                        resolve(true)
                      }
                    }catch(err){
                       console.log("Paystack.js: submitting pin error line : 86", err) 
                    }
                     
                    }else if(data.status == 'send_otp'){
                        console.log("rejectiifififififii")
                        reject({status: 'send_otp', reference: data.reference, displayText: response.data.display_text})
                    }else{
                        console.log("Whahahahahahahahahahahahahah");
                        resolve(true)
                    }
                }).catch(err => {
                    console.log("Payment Error data 110", err.data)
                    console.log("Payment Error response", err.data)
                    reject(err.data)
                })


        })

    },

    
}

const submitPin = (pin, reference) =>{
    return new Promise((resolve, reject) =>{
        console.log("Submitting pin")
        let url = 'https://api.paystack.co/charge/submit_pin'
        let paymentDetails = {
            pin,
            reference
        }
    
        axios.post(url, paymentDetails)
        .then(chargeResponse => {
        //    console.log("Charge response from from OTPsssssssssssssssss", chargeResponse.data, chargeResponse.status)
    
            if (chargeResponse.status) {
                // console.log("Returnnnnnfnfnfnfnfn")
             resolve(chargeResponse.data)
            }else{
                reject(false);
            }
        }).catch(err => {
            console.log("Payment Error data 123", err)
            console.log("Payment Error response", err.response.data)
            reject(err.data)
        })
    })
   

}

const checkPending = (reference) =>{
    return new Promise((resolve, reject) =>{
        let url = `https://api.paystack.co/charge/${reference}`;
        axios.get(url).then(chargeResponse => resolve(chargeResponse.data.data))
        .catch(err => reject(err))
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