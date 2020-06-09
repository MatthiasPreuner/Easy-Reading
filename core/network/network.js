const app = require('../../portal/app');

let network = {
    server: null,
    webSocketServer: null,
    webSocketConnections: [],
    initServer: function () {
        this.app = app;


        let http = require('http');
        let https = require('https');
        const fs = require('fs');

        if (!process.env.CLOUD_ENV) {
            const options = {
                key: fs.readFileSync('local/cert/localhost.key'),
                cert: fs.readFileSync('local/cert/localhost.cert'),
                requestCert: false,
                rejectUnauthorized: false
            };

            this.server = https.createServer(options, app);
            this.server.listen(8080);


        } else {

            this.server = http.createServer(app);
            let port = process.env.PORT || 3000;
            this.server.listen(port);
            console.log("Listening to port:"+port);
        }

        let WebSocketServerClass = require('ws').Server;
        this.webSocketServer = new WebSocketServerClass({
            server: this.server
        });

        console.log("WS init complete");

        this.webSocketServer.on('connection', function connection(ws, req) {
            //Host url

            const url = require('url');
            let hostname = req.headers.host;
            let pathname = url.parse(req.url).pathname;
            let baseUrl = 'https://' + hostname + pathname;

            let webSocketConnection = require("./websocket-connection");
            network.addWebSocketConnection(new webSocketConnection(ws, baseUrl));

        });


        let messageServerConnection = require("./message-server-connection");
        messageServerConnection.init();

      // network.kickConnections();
    },
    kickConnections: function (){
        //Used to test if clients would reconnect

        return;
        setTimeout(function () {
            network.kickConnections();
            for(const client of network.webSocketServer.clients)
            {
                client.close();
            }
        },30000);
    },
    addWebSocketConnection: function (webSocketConnection) {
        this.webSocketConnections.push(webSocketConnection);

    },
    removeWebSocketConnection: function (webSocketConnection) {

        let index = this.webSocketConnections.indexOf(webSocketConnection);
        if (index > -1) {
            this.webSocketConnections.splice(index, 1);
        }
    },

    getConnectionWithUUID: function (uuid) {

        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if (this.webSocketConnections[i].uuid === uuid) {
                return this.webSocketConnections[i];
            }
        }
        return null;

    },

    updateProfileForConnectedClients:function (profile,normalized = false) {
        console.log("Updating profile - active connections:"+this.webSocketConnections.length);


        let profileNormalized = normalized;
        for (let i = 0; i < this.webSocketConnections.length; i++) {

            if(this.webSocketConnections[i].profile){
                console.log("Comparing id: "+this.webSocketConnections[i].profile.id+ " with profile.id "+profile.id);
                if (this.webSocketConnections[i].profile.id === profile.id) {

                    console.log("Found match");
                    this.webSocketConnections[i].updateProfile(profile,profileNormalized);
                    profileNormalized = true;

                }
            }

        }

        let messageServerConnection = require("./message-server-connection");
        if(messageServerConnection.isEnabled){
            messageServerConnection.sendMessage({
                type: "userUpdate",
                message: profile.id
            })
        }

    },
    userUpdated: async function (pid) {
        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if(this.webSocketConnections[i].profile){
                if (this.webSocketConnections[i].profile.id === pid) {

                    let profileBuilder = require("../profile/profile-builder");
                    await profileBuilder.loadActiveUserInterfaces(this.webSocketConnections[i].profile);
                    this.webSocketConnections[i].updateProfile(this.webSocketConnections[i].profile,false);


                }
            }

        }

    },
    userLoginWebsocket: async function (message) {
        ///in case sticky sessions do not work. User logs in over http but is connected to another instance via websocket
        //Then a message is sent over the websocket server to find the corresponding connection and login the client.
        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if (this.webSocketConnections[i].uuid === message.token) {

                let loginInfo = message.loginInfo;

                let websocketConnection = this.webSocketConnections[i];
                let password = require('password-hash-and-salt');
                await password(loginInfo.id).hash("this is my salt and not yours!!!", async function (error, hashedUserLoginID) {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    let localeService = require("../../core/i18n/locale-service");
                    let clientProfile = require("../../core/profile/profile");
                    let currentProfile = new clientProfile(message.token);
                    currentProfile.email = loginInfo.email;
                    currentProfile.locale = localeService.getSupportedLanguage(loginInfo.locale);
                    currentProfile.loginType = loginInfo.loginType;

                    try {

                        if (loginInfo.loginType === "Facebook") {
                            await currentProfile.loginFacebook(hashedUserLoginID, currentProfile.email, websocketConnection);

                        } else if (loginInfo.loginType === "Google") {
                            await currentProfile.loginGoogle(hashedUserLoginID, currentProfile.email, websocketConnection);

                        } else if (loginInfo.loginType === "Anonym") {
                            await currentProfile.loginAnonym(hashedUserLoginID, currentProfile.email, websocketConnection);
                            websocketConnection.sessionID = message.sessionID;
                        }
                        websocketConnection.setProfile(currentProfile);
                        let loginResult = {
                            type: "userLoginResult",
                            result: currentProfile,
                        };


                        websocketConnection.sendMessage(loginResult);

                    } catch (e) {
                        console.log(e);

                    }


                });


            }

        }
    },
    userLogoutWebsocket:async function (token) {
        ///in case sticky sessions do not work. User logs in over http but is connected to another instance via websocket
        //Message is sent to logout the client also with the websocket connection after he logged out via http
        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if (this.webSocketConnections[i].uuid === token) {
                this.webSocketConnections[i].logout();

            }
        }
    },
    getProfileWithID:function (id) {
        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if(this.webSocketConnections[i].profile){
                if (this.webSocketConnections[i].profile.id === id) {
                    return this.webSocketConnections[i].profile;
                }
            }
        }
    },
    getWebSocketConnectionWithID:function(id){
        for (let i = 0; i < this.webSocketConnections.length; i++) {

            if(this.webSocketConnections[i].profile) {
                if (this.webSocketConnections[i].profile.id === id) {
                    return this.webSocketConnections[i];
                }
            }

        }
    }


};


module.exports = network;
