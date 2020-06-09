let express = require('express');
let router = express.Router();

const passport = require("passport");

router.get('/', function(req,res,next){

    if(req.query.token){
        req.session.returnTo = "/client/welcome";
        req.session._clientToken = req.query.token;
        if(req.session._select_account){
            passport.authenticate('google', { prompt: 'select_account', failureRedirect: '/client/login', })(req,res,next);
        }else{
            passport.authenticate('google')(req,res,next);
        }

    }else if(req.session._clientToken){
        req.session.returnTo = "/client/welcome";
        if(req.session._select_account){
            passport.authenticate('google', { prompt: 'select_account', failureRedirect: '/client/login', })(req,res,next);
        }else{
            passport.authenticate('google')(req,res,next);

        }

    }else{
        res.status(404).send('Not found');
    }


});

router.post('/',async function(req,res,next){
    if(req.isAuthenticated() && req.query.token) {
        req.session._clientToken = req.query.token;

        let passportLogin = require("../../passport/passportLogin");

        let loginInfo = {
            loginType: "Google",
            id: req.session.user.googleID,
            email: req.session.user.email,
            locale: req.session.user.locale,
        };
        await passportLogin.userLogin(req, loginInfo, function (profile, error) {

            if (profile) {
                res.send({
                    success: true,
                });

            } else {
                res.send({
                    success: false,
                });
            }
        });
    }else{
        res.send({
            success: false,
        });
    }

});



module.exports = router;