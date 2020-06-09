let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', function(req,res,next){
    return next();
});

module.exports = router;