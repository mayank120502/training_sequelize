const generateOTP = (length) =>{
    let otp = "";
    for(let i=0 ; i<length ; i++){
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

module.exports = {
    generateOTP,
}