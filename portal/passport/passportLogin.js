const profileRepo = require("../repository/profileRepo");
const {OAuth2Client} = require('google-auth-library');
const CHROME_CLIENT_ID = "691784987953-qc6ohlnk2n6g38ea7mugvbgcfcpar6g6.apps.googleusercontent.com";
const FIREFOX_CLIENT_ID = "691784987953-2t52gjtb395j4ore0lel1526o5nboefd.apps.googleusercontent.com";
const IOS_CLIENT_ID = "584464554129-3vsvg5igvdh7cfsc0prjkjpikq7nqd1s.apps.googleusercontent.com";
const client = new OAuth2Client(CHROME_CLIENT_ID);

async function userLogin(req, loginInfo, callback) {

    let userProfile = {};
    let error = null;

    //Client side login(extension, apps)...
    if (req.session._clientToken) {

        req.session.returnTo ="/client/welcome";
        let network = require("../../core/network/network");
        let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
        if (webSocketConnection) {

            let password = require('password-hash-and-salt');
            await password(loginInfo.id).hash("this is my salt and not yours!!!", async function (error, hashedUserLoginID) {
                if (error) {
                    console.log(error);
                    return;
                }

                let localeService = require("../../core/i18n/locale-service");
                let clientProfile = require("../../core/profile/profile");
                let currentProfile = new clientProfile(req.session._clientToken);
                currentProfile.email = loginInfo.email;
                currentProfile.locale = localeService.getSupportedLanguage(loginInfo.locale);
                currentProfile.loginType = loginInfo.loginType;

                try {

                    if (loginInfo.loginType === "Facebook") {
                        await currentProfile.loginFacebook(hashedUserLoginID, currentProfile.email, webSocketConnection);

                    } else if (loginInfo.loginType === "Google") {
                        await currentProfile.loginGoogle(hashedUserLoginID, currentProfile.email, webSocketConnection);

                    } else if (loginInfo.loginType === "Anonym") {
                        await currentProfile.loginAnonym(hashedUserLoginID, currentProfile.email, webSocketConnection);
                        webSocketConnection.sessionID = req.session.id;
                    }
                    webSocketConnection.setProfile(currentProfile);
                    let loginResult = {
                        type: "userLoginResult",
                        result: currentProfile,
                    };

                    /*
                    //TODO Reduce data size - move libraries like jQueryUI to extension
                    let totalDataToSend = JSON.stringify(loginResult);
                    let byteLength = Buffer.byteLength(totalDataToSend, 'utf8');
                    */


                    webSocketConnection.sendMessage(loginResult);
                    currentProfile.userId = currentProfile.googleID;

                    const userProfile = await profileRepo.getProfileByEmail(currentProfile.email);

                    if(currentProfile.isNewProfile){
                        userProfile.isNewProfile = true;
                    }


                    userProfile.clientLogin = true;

                    callback(userProfile, error);


                } catch (e) {

                    console.log(e);
                    callback(userProfile, e);


                }


            });
        }else{

            ///in case sticky sessions do not work. User logs in over http but is connected to another instance via websocket
            //Therefore we log in the user over http, and pass the loginInfo to the message server that broadcasts it to all the other instances
            let password = require('password-hash-and-salt');
            await password(loginInfo.id).hash("this is my salt and not yours!!!", async function (error, hashedUserLoginID) {
                if (error) {
                    console.log(error);
                    return;
                }

                let localeService = require("../../core/i18n/locale-service");
                let clientProfile = require("../../core/profile/profile");
                let currentProfile = new clientProfile(req.session._clientToken);
                currentProfile.email = loginInfo.email;
                currentProfile.locale = localeService.getSupportedLanguage(loginInfo.locale);
                currentProfile.loginType = loginInfo.loginType;

                try {

                    if (loginInfo.loginType === "Facebook") {
                        await currentProfile.loginFacebook(hashedUserLoginID, currentProfile.email, null);

                    } else if (loginInfo.loginType === "Google") {
                        await currentProfile.loginGoogle(hashedUserLoginID, currentProfile.email, null);

                    } else if (loginInfo.loginType === "Anonym") {
                        await currentProfile.loginAnonym(hashedUserLoginID, currentProfile.email, null);
                    }

                    let sessionID = req.session.id;
                    let clientToken = req.session._clientToken;

                    currentProfile.userId = currentProfile.googleID;

                    const userProfile = await profileRepo.getProfileByEmail(currentProfile.email);

                    if(currentProfile.isNewProfile){
                        userProfile.isNewProfile = true;
                    }

                    userProfile.clientLogin = true;

                    callback(userProfile, error);

                    let messageServerConnection = require("../../core/network/message-server-connection");
                    if(messageServerConnection.isEnabled){
                        messageServerConnection.sendMessage({
                            type: "userLoginWebsocket",
                            message: {
                                profileID: userProfile.id,
                                token: clientToken,
                                sessionID: sessionID,
                                loginInfo: loginInfo,


                            }
                        });
                    }


                } catch (e) {

                    console.log(e);
                    callback(userProfile, e);


                }


            });
        }


    } else {

        //Portal side login, Caretakers & Clients
        try {

            req.session.returnTo ="/";
            const healthCareWorkerProfile = await profileRepo.getProfileByEmail(loginInfo.email);

            if (healthCareWorkerProfile) {
                callback(healthCareWorkerProfile, error);
            } else {


                const profileData = {
                    email: loginInfo.email,
                    roles: ["caretaker"]
                };
                if (loginInfo.loginType === "Facebook") {

                } else if (loginInfo.loginType === "Google") {

                }
                const profileBuilder = require("../../core/profile/profile-builder");
                await profileBuilder.saveProfile(profileData, false);

                callback(profileData, error);

            }


        } catch (e) {
            console.log(e);
            callback(userProfile, e);

        }


    }


}


async function createRandomEmail() {

    const databaseManager = require("../../core/database/database-manager");
    let email = null;
    while (!email) {

        let newEmail = "anonym" + randomInt(1, 10000000) + "@easyreading.eu";

        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", newEmail);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);


        if (loadProfileRequestResult.result.length === 0) {
            email = newEmail;
        }

    }

    return new Promise(function (resolve, reject) {
        resolve(email);
    });


}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

async function createLoginInfoAnonym(req, uuid) {
    let locale = "en";
    if (req.query.lang) {
        locale = req.query.lang;
    }

    if (req.query.googleToken) {

        let googleInfo = await verifyGoogleToken(req.query.googleToken);

        if (googleInfo) {

            let profileInfo = {
                id: googleInfo.googleId,
                emails: [
                    {value: googleInfo.email}
                ],
                _json: {
                    language: locale,
                }

            };


            return await createLoginInfoGoogle(req, profileInfo);


        }

    }

    let randomEmail = await createRandomEmail();


    return {
        loginType: "Anonym",
        id: uuid,
        email: randomEmail,
        locale: locale,
    };
}

async function verifyGoogleToken(token) {

    try {

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [CHROME_CLIENT_ID, FIREFOX_CLIENT_ID, IOS_CLIENT_ID] // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        console.log("verify token- user id: " + userId);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        return {
            googleId: payload['sub'],
            email: payload['email']
        };
    } catch (e) {

        console.log("Error verifying Goolge Token:" + token);
    }

}

async function createLoginInfoGoogle(req, profile) {

    let locale = "en";
    if (profile._json) {
        if (profile._json.language) {
            locale = profile._json.language.split("_")[0];


        }
    }

    return {
        loginType: "Google",
        id: profile.id,
        email: profile.emails[0].value,
        locale: locale,
    }
}

async function createLoginInfoFacebook(req, profile) {

    return {
        loginType: "Facebook",
        id: profile.id,
        email: profile.emails[0].value,
        locale: "en",
    };
}

module.exports = {
    userLogin: userLogin,
    createLoginInfoAnonym: createLoginInfoAnonym,
    createLoginInfoGoogle: createLoginInfoGoogle,
    createLoginInfoFacebook: createLoginInfoFacebook,

};

