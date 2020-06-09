const {OAuth2Client} = require('google-auth-library');
const CHROME_CLIENT_ID = "691784987953-qc6ohlnk2n6g38ea7mugvbgcfcpar6g6.apps.googleusercontent.com";
const FIREFOX_CLIENT_ID = "691784987953-2t52gjtb395j4ore0lel1526o5nboefd.apps.googleusercontent.com";
const IOS_CLIENT_ID = "584464554129-3vsvg5igvdh7cfsc0prjkjpikq7nqd1s.apps.googleusercontent.com";
const client = new OAuth2Client(CHROME_CLIENT_ID);
const uuidV4 = require('uuid/v4');

class WebSocketConnection {
    constructor(ws, url) {
        this.loggedIn = false;
        this.ws = ws;
        this.url = url;
        this.uuid = uuidV4();
        this.profile = null;
        console.log("Base URL:", url);
        const webSocketConnection = this;
        this.customFunctions = [];
        this.recomendationTimeout = null;
        this.sessionID = null;

        ws.on('message', function incoming(msg) {
            webSocketConnection.messageReceived(msg);
        });
        ws.on('close', function close() {
            webSocketConnection.connectionClosed();
        });



    }

    setProfile(profile){

        this.profile = profile;

        try{
            if(this.profile.ui_mode === "adaptive"){
                this.startAdaptivity();
            }
        }catch (e) {
            console.log(e);
        }

    }

    startAdaptivity(){
        const webSocketConnection = this;
        this.recomendationTimeout = setTimeout(async function () {
            await webSocketConnection.createRecommendation();
        }, 60000);
        console.log("Adaptivity started");
    }
    stopAdaptivity(){
        if(this.recomendationTimeout){
            clearTimeout(this.recomendationTimeout);
            this.recomendationTimeout = null;
        }

        console.log("Adaptivity stopped");

    }

    async messageReceived(msg) {

        let errorMsg = null;

        try {
            if (msg === "[object Object]") {
                return;
            }

            let core = null;
            let req = JSON.parse(msg);
            if (req.type !== "ping") {
                console.log("Message received:");
                console.log(msg);
                if (req.type !== "userLogin" && req.type !== "getUUID") {
                    core = rootRequire("./core/core");  // Most messages perform a call to the core
                }
            }
            if (req.type === "userLogin") {
                //Just send default profile back

                if (typeof req.data.google_id_token !== "undefined") {

                    try {
                        /*get user google id:*/
                        let userInfo = await this.verify(req.data.google_id_token);

                        let password = require('password-hash-and-salt');
                        let webSocketConnection = this;

                        password(userInfo.googleId).hash("this is my salt and not yours!!!", async function (error, hashedGoogleID) {
                            if (error) {
                                console.log(error);
                                return;
                            }


                            let profile = require("./../profile/profile");
                            let currentProfile = new profile(webSocketConnection.uuid);
                            currentProfile.email = userInfo['email'];

                            try {
                                await currentProfile.login(hashedGoogleID, webSocketConnection);
                                webSocketConnection.profile = currentProfile;
                                req.type = "userLoginResult";
                                req.result = currentProfile;
                                webSocketConnection.sendMessage(req);

                            } catch (error) {
                                errorMsg = error;


                            }

                            return new Promise(function (resolve, reject) {
                                if (errorMsg) {
                                    console.log(errorMsg);
                                    reject(errorMsg);
                                } else {
                                    resolve();
                                }

                            });


                        });

                    } catch (error) {
                        errorMsg = error;
                    }

                    return new Promise(function (resolve, reject) {

                        if (errorMsg) {
                            console.log(errorMsg);
                            reject(errorMsg);
                        } else {
                            resolve();
                        }

                    });
                }


            } else if (req.type === "cloudRequest") {

                if (!this.profile) {

                    console.log("attempted a cloud request without a profile.");
                    try{
                        if(this.ws){
                            this.ws.close();
                        }
                    }catch (e) {
                        console.log(e);
                    }
                    return;
                }

                let config = this.profile.getConfigurationForFunction(req);

                //TODO Check if profile has this function....

                await core.executeRequest(this, req, config);


            } else if (req.type === "getUUID") {

                this.redirectURL = req.redirectURL;
                this.sendMessage({
                    type: "getUUIDResult",
                    result: this.uuid,
                });

            } else if (req.type === "triggerHelp") {
                let help_possible = false;
                if ('input' in req) {
                    try {
                        let input = JSON.parse(req.input);
                        let wait_tools = [];
                        if ('wait_tools' in req) {
                            wait_tools = JSON.parse(req.wait_tools);
                        }
                        let tool = await core.reasonerUtils.preferredTool(this.profile, input);
                        if (tool !== null && tool.length === 2) {
                            let helpers = rootRequire("./core/util/helper-functions");
                            let wait = helpers.arrayInArray(tool, wait_tools);
                            help_possible = true;
                            let gaze_x = 0, gaze_y = 0;
                            if ('gaze_x' in req) {
                                gaze_x = req.gaze_x;
                            }
                            if ('gaze_y' in req) {
                                gaze_y = req.gaze_y;
                            }
                            this.sendMessage({
                                type: "triggerRequest",
                                windowInfo: req.windowInfo,
                                automatic: req.automatic,
                                ui_i: tool[0],
                                tool_i: tool[1],
                                x: gaze_x,
                                y: gaze_y,
                                waitForPresentation: wait,
                            });
                        }
                    } catch (err) {
                        errorMsg = "Error triggering help: wrong request payload";
                    }
                }
                if (!help_possible) {
                    this.sendMessage({
                        type: "triggerHelpFailed",
                    });
                }
            } else if (req.type === "loadReasoner") {
                let reasoner_data = await core.reasonerUtils.loadProfileReasoner(this.profile, 'enabled', true, false);
                if (reasoner_data.length > 0) {
                    this.sendMessage({
                        type: "userReasoner",
                        reasoner_data: JSON.stringify(reasoner_data[0]),
                    });
                }

            } else if (req.type === "persistReasoner") {
                let reasoner_data = JSON.parse(req.reasoner_data);
                let reasoner_id = await core.reasonerUtils.persistReasoner(reasoner_data, this.profile);
                if (reasoner_id > 0) {
                    this.sendMessage({
                        type: "setReasonerId",
                        reasoner_id: reasoner_id,
                    });
                }
            } else if (req.type === "persistReasonerParams") {
                let reasoner_data = JSON.parse(req.reasoner_data);
                await core.reasonerUtils.persistUserReasonerParams(reasoner_data, this.profile);
            } else if (req.type === "loadReasonerParams") {
                let params = await core.reasonerUtils.loadReasonerParams(req.rid);
                this.sendMessage({
                    type: "reasonerParams",
                    rid: req.rid,
                    params: JSON.stringify(params),
                });
            }
            //Testing mobile client without Google Login
            else if (req.type === "mobileTestLogin") {
                let profile = require("./../profile/profile");
                let profileBuilder = require("./../profile/profile-builder");
                let currentProfile = new profile();
                profileBuilder.loadDefaultProfile(currentProfile);
                this.profile = currentProfile;

                profileBuilder.createClassMappings(currentProfile);

                if (!currentProfile.debugMode) {
                    profileBuilder.normalizeCSSPaths(currentProfile, this.url);
                }
                profileBuilder.normalizeIconPaths(currentProfile, this.url);
                profileBuilder.normalizeRemoteAssetDirectoryPaths(this, websocketConnection.url);
                this.sendMessage(currentProfile);


            }else if(req.type === "recommendationResult"){


                let profileRecommendation = require("./../profile/profile-recommendation");
                await profileRecommendation.createConfigurationForRecommendation(req.data,this.profile.id);

            }else if(req.type === "surveyResult") {

                try{

                    let password = require('password-hash-and-salt');
                    let profile = this.profile;
                    if(this.profile.id){
                        password(this.profile.id.toString()).hash("another salt for you", async function (error, hashedId) {
                            let data = {
                                hashedId: hashedId,
                                locale: profile.locale,
                                timestamp: Math.floor(Date.now()/1000),
                                data: req.data,
                            };
                            let databaseManager = require("../database/database-manager");
                            let insertSurveyRequest = databaseManager.createRequest("survey_entry").insert(data);
                            await databaseManager.executeRequest(insertSurveyRequest);


                        });
                    }



                }catch (error) {
                    console.log(error);
                }

            }

        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {

            if (errorMsg) {
                console.log(errorMsg);
                reject(errorMsg);
            } else {
                resolve();
            }

        });


    }

    sendMessage(msg) {


        try {
            this.ws.send(JSON.stringify(msg));
        } catch (error) {
            console.log(error);
        }
    }

    async connectionClosed() {


        const session = require("express-session");
        const passport = require("passport");

        const app = require("../../portal/app");
        await this.logoutUser();

        if(this.sessionID){
            let databaseManager = require("../database/database-manager");
            let deleteRoleRequest = databaseManager.createRequest("sessions").where("session_id", "=", this.sessionID).delete();
            await databaseManager.executeRequest(deleteRoleRequest);
        }


        this.stopAdaptivity();

        let network = require("./network");
        network.removeWebSocketConnection(this);
        console.log("Closed");

    }

    createUserDirectory() {

    }

    async logout() {
        let request = {
            type: "userLogout",
            result: null,
        };
        this.sendMessage(request);
        await this.logoutUser();
    }

    updateProfile(profile, normalized) {
        profile.uuid = this.profile.uuid;
        let profileBuilder = require("../profile/profile-builder");
        profileBuilder.createClassMappings(profile);

        if (!normalized) {

            if (!profile.debugMode) {
                profileBuilder.normalizeCSSPaths(profile, this.url);
            }
            profileBuilder.normalizeIconPaths(profile, this.url);
            profileBuilder.normalizeRemoteAssetDirectoryPaths(profile, this.url);
        }

        this.profile = profile;

        console.log("Sending update message");
        let request = {
            type: "userUpdateResult",
            result: this.profile,
        };

        this.sendMessage(request);


    }


    async verify(token) {
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
    }

    async logoutUser() {
        if (this.profile) {

            await this.profile.logout();
            this.profile = null;
        }
    }

    async createRecommendation () {
        const webSocketConnection = this;
        if(this.profile){
            let profileRecommendation = require("../profile/profile-recommendation");
            let recommendation = await profileRecommendation.createRecommendation(this.profile);
            if(recommendation){
                recommendation.normalizeIconPaths(this.url);
                this.sendMessage({type: "recommendation", data :recommendation});
            }

        }

        this.recomendationTimeout = setTimeout(function () {


            webSocketConnection.createRecommendation();
        }, 60*60*1000);


    }
}

module.exports = WebSocketConnection;