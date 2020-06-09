let messageServerConnection = {
    webSocket: null,
    url: "",
    nameSpace:"",
    password:"",
    isConnected: false,
    isEnabled:false,
    messageQueue:[],
    init: function () {

        try {
            if(!process.env.MESSAGE_SERVER_URL || !process.env.MESSAGE_SERVER_NAMESPACE ||  !process.env.MESSAGE_SERVER_PASSWORD){
                console.log("No message server credentials were detected.");

                return;
            }

            messageServerConnection.url = process.env.MESSAGE_SERVER_URL;
            messageServerConnection.nameSpace = process.env.MESSAGE_SERVER_NAMESPACE;
            messageServerConnection.password = process.env.MESSAGE_SERVER_PASSWORD;

            messageServerConnection.isEnabled = true;

            const WebSocket = require('ws');
            messageServerConnection.webSocket = new WebSocket(messageServerConnection.url,null,null);
            messageServerConnection.webSocket.onopen = this.onOpen;
            messageServerConnection.webSocket.onmessage = this.onMessage;
            messageServerConnection.webSocket.onclose = this.onClose;
            messageServerConnection.webSocket.onerror = this.onError;
            return true;
        }catch (e) {
            console.log(e);
            return false;
        }

    },

    closeWebSocket: function () {

        if (this.webSocket) {
            try{
                this.webSocket.onopen = null;
                this.webSocket.onmessage = null;
                this.webSocket.onclose = null;
                this.webSocket.onerror = null;
                this.webSocket.close();
            }catch (e) {
                console.log(e);
            }

        }
    },

    onOpen: function (event) {
        messageServerConnection.isConnected = true;

        messageServerConnection.sendMessage({
            type:"registerNamespace",
            message:{
                namespace: messageServerConnection.nameSpace,
                password: messageServerConnection.password
            },

        });

        messageServerConnection.update();

        console.log("connected to message server");

    },

    onMessage: function (message) {

        try {
            let req = JSON.parse(message.data);
            if (req.type === "userUpdate"){

                let network = require("./network");
                network.userUpdated(req.message);
            }else if (req.type === "userLoginWebsocket"){

                let network = require("./network");
                network.userLoginWebsocket(req.message);
            }else if (req.type === "userLogoutWebsocket"){

                let network = require("./network");
                network.userLogoutWebsocket(req.message);
            }else if(req.type === "registerNamespaceComplete"){
                for(let i=0; i< messageServerConnection.messageQueue.length; i++){
                    messageServerConnection.sendMessage(messageServerConnection.messageQueue[i]);
                }
                this.messageQueue = [];
            }
        } catch (e) {
            console.log("ws: error on m essage- " + e);
        }
    },
    onClose: function (event) {
        messageServerConnection.isConnected = false;
        messageServerConnection.closeWebSocket();
        messageServerConnection.webSocket = null;
        messageServerConnection.reconnect();
        console.log("connection to message server lost");

    },
    onError: function (event) {
        messageServerConnection.onClose(event);

    },
    sendMessage: function (message) {
        if(this.isEnabled){
            if (this.isConnected) {
                this.webSocket.send(JSON.stringify(message));
            }else{

                //Clear array if message server would be away longer
                if(this.messageQueue.length > 1000){
                    console.log("queue too long.")
                    this.messageQueue = [];
                }
                this.messageQueue.push(message);

            }
        }

    },

    reconnect: function () {
        console.log("ws: recconect");
        setTimeout(function () {
            messageServerConnection.init();
        }, 100);
    },

    update:function () {

        if(this.isConnected){
            let network = require("./network");

            this.sendMessage({
                type: "update",
                message: network.webSocketConnections.length,
            });
            setTimeout(function () {
                messageServerConnection.update();
            }, 10000);
        }
    },

};

module.exports = messageServerConnection;