let express = require('express');
let router = express.Router();

const passport = require("passport");

router.get('/', function (req, res, next) {

    req.session.returnTo = "/client/welcome";
    passport.authenticate('anonymId', {
            failureRedirect: '/client/login/anonym',
            session: true
        }
    )(req, res, next);


});

router.post('/', async function (req, res, next) {
    res.send({
        success: false,
    });


});


module.exports = router;