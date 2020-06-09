module.exports = {
    setUser: async (req, res, next) => {
        res.locals.user = req.user;
        res.locals.healthcareworker = false;
        res.locals.roles = [];
        if (req.user) {
            res.locals.healthcareworker = req.user.role === 1;

            res.locals.roles = req.user.roles;
        }else{
            res.locals.roles.push("anonymous_user");

        }


        return next();
    }
};