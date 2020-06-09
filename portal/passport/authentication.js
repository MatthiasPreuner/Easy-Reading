
module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    },
    redirectToOrigin: (req, res, next) => {
        if(req.session._clientToken){
            //console.log(req.session._clientToken);
        }

        //res.send(`Welcome ${JSON.stringify(req.user)}`);
        req.session.user  = {...req.user};
        let returnURL = req.session.returnTo || '/';
        delete req.session.returnTo;

        res.redirect(returnURL);

    }
}