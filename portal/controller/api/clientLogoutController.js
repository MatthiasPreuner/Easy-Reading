let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', async function(req,res,next){

    req.session._select_account = true;

    //If user is still logged in
    if(req.user){

        //If user is logged in as client
        if(req.session._clientToken){
            let network = require("../../../core/network/network");
            let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);

            let token = req.session._clientToken;
            delete req.session._clientToken;

            req.logout();

            if(webSocketConnection){
                await webSocketConnection.logout();
            }else{
                ///in case sticky sessions do not work. User logs in over http but is connected to another instance via websocket
                ///Need to send a message to logout
                let messageServerConnection = require("../../../core/network/message-server-connection");
                if(messageServerConnection.isEnabled){
                    messageServerConnection.sendMessage({
                        type: "userLogoutWebsocket",
                        message: token,
                    });
                }
            }
            res.redirect("/logout-success");


            //If user is logged in as caretaker
        }else{
            req.logout();
            res.redirect('/');
        }

    }else{
        //Redirect user to caretaker start page
        res.redirect('/');
    }





});

module.exports = router;