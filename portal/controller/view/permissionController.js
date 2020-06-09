module.exports = {
    isLoggedInAsClient:  (req, res, next) => {

        if(!req.session._clientToken){

            return res.redirect('/');
        }

        return next();
    },
    hasPermission: async (req, res, next) => {


        if(req.method === "GET"){
            const id = parseInt(req.query.id);
            if (!id) {
                return res.redirect('/profiles');
            }

            if(id === req.user.id){
                return next();
            }


            try{
                let databaseManager = require("../../../core/database/database-manager");

                let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",req.user.id).where("client_id","=",id);
                let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);
                if(loadExistingClientCarerRelationsResult.result.length > 0){
                    return next();
                }


            }catch (e) {
                console.log(e);
            }



            return res.redirect('/profiles');
        }else{


            try{

                let id = req.user.id;
                if (req.body.id) {
                    id = req.body.id;
                }

                if(typeof  id === "string"){
                    id = parseInt(id);
                }

                if(id === req.user.id){
                    return next();
                }

                let databaseManager = require("../../../core/database/database-manager");

                let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",req.user.id).where("client_id","=",id);
                let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);
                if(loadExistingClientCarerRelationsResult.result.length > 0){
                    return next();
                }

            }catch (e) {

                console.log(e);
            }
            return res.status(403);





        }

    }
};