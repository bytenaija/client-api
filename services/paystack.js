const axios = require('axios')
let winston = require('../config/winston');
let fs = require('fs')
,path = require('path'), util = require('util')

module.exports = {

    sendOTP: (reference, OTP)=>{

        winston.info("Sending OTP", reference, OTP);
        return new Promise((resolve, reject) => {

        let paymentDetails = {
            reference,
            otp: OTP
        }

        axios.interceptors.response.use((response) => {
            fs.writeFileSync( path.join(__dirname, '..', 'OTPsuccess.log'), util.inspect(response.data))
            winston.info("Line 20 paystack OTP", util.inspect(response.data))
            if(response.data){
                if(response.data.data){
                    return response.data.data
                }
                return response.data;
            }
            return response
            
        }, function (error) {
            
           if(error.response){
          
            if(error.response.data){
                if(error.response.data.data){
                    fs.writeFileSync( path.join(__dirname, '..', 'OTPerror.log'), JSON.stringify(error.response.data.data))
                    winston.error("OTPERROR", error.response.data.data)
                    return Promise.reject(error.response.data.data);
                }else{
                    fs.writeFileSync( path.join(__dirname, '..', 'OTPerror.log'), JSON.stringify(error.response.data))
                    winston.error("OTPError", error.response.data)
                    return Promise.reject(error.response.data);
                }
                
            }else{
                // fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response))
                winston.error(error.response)
                return Promise.reject(error.response)
            }
        }else{
            winston.error(error)
            return Promise.reject(error)
        }
        });

        axios.post(`https://api.paystack.co/charge/submit_otp`, paymentDetails)
                .then( async chargeResponse => {
                   winston.info("Charge response from sending OTP", chargeResponse.data)
                        
                    if (chargeResponse.data.status == 'success') {
                        winston.info('resolving true')
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
       winston.info("email", email)
        return new Promise((resolve, reject) => {

            axios.interceptors.response.use((response) => {
                fs.writeFileSync( path.join(__dirname, '..', 'success.log'), util.inspect(response.data))
                winston.info("Line 54 paystack intec", util.inspect(response.data))
                if(response.data){
                    if(response.data.data){
                        return response.data.data
                    }
                    return response.data;
                }
                return response
                
            }, function (error) {
                
               if(error.response){
              
                if(error.response.data){
                    if(error.response.data.data){
                        fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response.data.data))
                        winston.error(error.response.data.data)
                        return Promise.reject(error.response.data.data);
                    }else{
                        fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response.data))
                        winston.error(error.response.data)
                        return Promise.reject(error.response.data);
                    }
                    
                }else{
                    // fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response))
                    winston.error(error.response)
                    return Promise.reject(error.response)
                }
            }else{
                winston.error(error)
                return Promise.reject(error)
            }
               
               
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

            //winston.info(transaction)

            axios.post(`https://api.paystack.co/charge`, transaction)
                .then( async chargeResponse => {
                    winston.info("Charge response data data", chargeResponse)
                    let data = chargeResponse
                   winston.info("Charge response data data", data)

                    if (data.status == 'send_pin') {
                    try{
                      let response =  await submitPin(pin, data.reference)
                      winston.info("responsesssss", response)
                      winston.info("Optdddddddddddddddddddddddd", response.data.display_text, data.reference);
                      if(response.data.status == 'send_otp'){
                          winston.info("rejectiifififififii")
                          reject({status: 'send_otp', reference: data.reference, displayText: response.data.display_text})
                      }else{
                        winston.info("BBBDBBDBDBDBDBDBDBDB");
                        resolve(true)
                      }
                    }catch(err){
                       winston.error("Paystack.js: submitting pin error line : 86", err)
                       reject(err) 
                    }
                     
                    }else if(data.status == 'send_otp'){
                        winston.info("rejectiifififififii")
                        reject({status: 'send_otp', reference: data.reference, displayText: data.display_text})
                    }else if(data.status == 'pending'){
                        winston.info("Pending");
                        
                        setTimeout(async ()=>{
                            try{
                            let result = await checkPending(data.reference);
                            if(result.status == 'failed'){
                                reject({status: 'failed',  displayText: result.message})
                            }else{
                                resolve(true)
                            }
                            }catch(err){
                                reject({status: 'failed',  displayText: err.message})
                            }
                        })
                       
                        
                    }else if(data.status == 'success'){
                        winston.info("Whahahahahahahahahahahahahah");
                        resolve(true)
                    }else{
                        reject({status: 'failed',  displayText: 'An unknown error occured. Please try again'})
                    }
                }).catch(err => {
                    winston.error("Payment Error response paystack.js ln 114", err)
                    if(err.status) {
                        if(err.status == 'failed'){
                            // 
                            reject({status: 'failed',  displayText: err.message})
                        }else{
                            reject({status: 'failed',  displayText: "An unknown error occured. Please try again."})
                        }
                    }else{
                       
                            reject({status: 'failed',  displayText: "An unknown error occured. Please try again."})
                        
                    }
                   
                   
                })


        })

    },

    
}

const submitPin = (pin, reference) =>{
    return new Promise((resolve, reject) =>{
        winston.info("Submitting pin")
        let url = 'https://api.paystack.co/charge/submit_pin'
        let paymentDetails = {
            pin,
            reference
        }
    
        axios.post(url, paymentDetails)
        .then(chargeResponse => {
        //    winston.info("Charge response from from OTPsssssssssssssssss", chargeResponse.data, chargeResponse.status)
    
            if (chargeResponse.status) {
                // winston.info("Returnnnnnfnfnfnfnfn")
             resolve(chargeResponse.data)
            }else{
                reject(false);
            }
        }).catch(err => {
            winston.error("Payment Error response paystack 144", err.data)
            reject(err.data)
        })
    })
   

}

const checkPending = (reference) =>{
    axios.interceptors.response.use((response) => {
        fs.writeFileSync( path.join(__dirname, '..', 'success.log'), util.inspect(response.data))
        winston.info("Line 54 paystack intec", util.inspect(response.data))
        if(response.data){
            if(response.data.data){
                return response.data.data
            }
            return response.data;
        }
        return response
        
    }, function (error) {
        
       if(error.response){
      
        if(error.response.data){
            if(error.response.data.data){
                fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response.data.data))
                winston.error(error.response.data.data)
                return Promise.reject(error.response.data.data);
            }else{
                fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response.data))
                winston.error(error.response.data)
                return Promise.reject(error.response.data);
            }
            
        }else{
            // fs.writeFileSync( path.join(__dirname, '..', 'error.log'), JSON.stringify(error.response))
            winston.error(error.response)
            return Promise.reject(error.response)
        }
    }else{
        winston.error(error)
        return Promise.reject(error)
    }
       
       
    });
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