let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {
    let databaseManager = require("../../../core/database/database-manager");
    let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",req.user.id);
    let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);
    let profileRepo = require("../../repository/profileRepo");
    let existingClientCarerRelations = [];

    for(let i=0; i < loadExistingClientCarerRelationsResult.result.length; i++){
        let clientProfile = await profileRepo.getProfileId(loadExistingClientCarerRelationsResult.result[i].client_id);

        if(clientProfile){
            existingClientCarerRelations.push({
                email: clientProfile.email,
                id: clientProfile.id,
            });
        }
    }

    res.locals.existingClientCarerRelations = existingClientCarerRelations;

    return next();
});

module.exports = router;