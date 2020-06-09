let serverURL = "";

if(process.env["SERVER_URL"]){
    serverURL = process.env["SERVER_URL"];
}

module.exports = {


    google : {
        callbackURL: serverURL+"/auth/callback",
        clientID: "182795011122-jgj96rhi5chbflic65bsaro75i56u4r7.apps.googleusercontent.com",
        clientSecret: "nHYnwqLwpXu22mcQ0u4U_dy4",
        scope: ["profile", "email","openid"]
    }
}