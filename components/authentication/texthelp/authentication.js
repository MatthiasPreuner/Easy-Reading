let authentication = rootRequire("/core/authentication/authentication-base");

class TextHelpAuth extends authentication {
    constructor() {
        super();
        this.token = null;
        this.tokenExpiryDate = null;
        this.refresh_token = null;
        this.credentialManager = require("../../../core/util/credential-manager");

    }

    getToken(callback) {

        //Refresh token 10 minutes earlier
        if (this.tokenExpiryDate > Date.now() + 600000) {

            callback(this.token);
            return;


        }

        let request = require('request');
        let engine = this;

        if (this.refresh_token) {

            let options = {
                method: 'POST',
                url: 'https://easy-reading-api.dev.texthelp.com/api/auth/refresh',
                json: {refresh_token: this.refresh_token},
            };

            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    engine.token = null;
                    engine.tokenExpiryDate = null;
                    engine.refresh_token = null;
                    callback(err);
                    return;
                }

                try {

                    if (body.status === "success") {
                        engine.token = body.data.token;
                        engine.tokenExpiryDate = Date.now()+ body.data.expires;
                        callback(engine.token);
                    } else {

                        console.log(body.data.message);
                    }


                } catch (err) {
                    console.log(err);
                    engine.token = null;
                    engine.times = null;
                    callback(err);
                }
            });
        } else {

            let options = {
                method: 'POST',
                url: 'https://easy-reading-api.dev.texthelp.com/api/auth/generate',
                json: this.getCredentials(),
            };


            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    engine.token = null;
                    engine.tokenExpiryDate = null;
                    callback(err);
                    return;
                }

                try {

                    if (body.status === "success") {
                        engine.token = body.data.token;
                        engine.tokenExpiryDate = Date.now()+ body.data.expires;
                        engine.refresh_token = body.data.refresh_token;
                        callback(engine.token);
                    } else {

                        callback();
                    }


                } catch (err) {
                    engine.token = null;
                    engine.times = null;
                    console.log(err);
                    callback();
                }
            });
        }

    }

    getCredentials() {
        if (process.env.TEXTHELP_USER && process.env.TEXTHELP_PW) {

            return {
                client_id: process.env.TEXTHELP_USER,
                client_secret: process.env.TEXTHELP_PW,
            }
        }

        if (this.credentialManager.hasKey("TEXTHELP_USER") && this.credentialManager.hasKey("TEXTHELP_PW")) {

            return {
                client_id: this.credentialManager.getValueForKey("TEXTHELP_USER"),
                client_secret: this.credentialManager.getValueForKey("TEXTHELP_PW"),
            }
        }

        return {};


    }
}

module.exports = TextHelpAuth;