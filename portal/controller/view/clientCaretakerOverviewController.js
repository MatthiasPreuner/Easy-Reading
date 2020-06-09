let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {
    let databaseManager = require("../../../core/database/database-manager");
    let errorMessages = [];
    if (req.method === "POST") {

        if(req.body.email){

            let profileRepo = require("../../repository/profileRepo");

            let account = await profileRepo.getProfileByEmail(req.body.email);

            let name = req.body.name;

            if(name === ""){
                errorMessages.push({
                    message: "no_name_given"
                });
            }else if(account){

                if(account.roles.includes("caretaker")){
                    if(req.user.id !== account.id){
                        let databaseManager = require("../../../core/database/database-manager");

                        let loadExistingClientCarerRelationRequest = databaseManager.createRequest("client_carer_relation").where("carer_id", "=", account.id).where("client_id","=",req.user.id);


                        let loadExistingClientCarerRelationResult = await databaseManager.executeRequest(loadExistingClientCarerRelationRequest);

                        if(loadExistingClientCarerRelationResult.result.length === 0){
                            let newRelation = {
                                client_id: req.user.id,
                                carer_id: account.id,
                                carer_name: name
                            };


                            let storeClientCaretakerRelationRequest = databaseManager.createRequest("client_carer_relation").insert(newRelation);
                            await databaseManager.executeRequest(storeClientCaretakerRelationRequest);

                            res.redirect("/client/caretakers");
                            return;
                        }else{
                            errorMessages.push({
                                message: "caretaker_already_assigned",
                                additionalInfo: account.email,
                            });
                        }


                    }else{
                        errorMessages.push({
                            message: "caretaker_cannot_be_you"
                        });
                    }
                }else{
                    errorMessages.push({
                        message: "user_is_not_a_caretaker",
                        additionalInfo: account.email,
                    })
                }




            }else{
                errorMessages.push({
                    message: "user_not_found",
                    additionalInfo:req.body.email
                });
            }
        }else{
            let careTakersToRemove = Object.keys(req.body);
            for(let i=0; i < careTakersToRemove.length; i++){

                let caretakerID = careTakersToRemove[i].split("_")[1];

                let deleteExistingClientCarerRelationShipRequest = databaseManager.createRequest("client_carer_relation").where("client_id","=",req.user.id).where("carer_id","=",caretakerID).delete();
                await databaseManager.executeRequest(deleteExistingClientCarerRelationShipRequest);

            }
        }



    }

    let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("client_id","=",req.user.id);
    let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);

    let profileRepo = require("../../repository/profileRepo");

    let existingClientCarerRelations = [];
    for(let i=0; i < loadExistingClientCarerRelationsResult.result.length; i++){

        let carerProfile = await profileRepo.getProfileId(loadExistingClientCarerRelationsResult.result[i].carer_id);

        if(carerProfile){
            existingClientCarerRelations.push({
                email: carerProfile.email,
                id: carerProfile.id,
                name: loadExistingClientCarerRelationsResult.result[i].carer_name
            });
        }
    }

    if(existingClientCarerRelations.length > 0){
        res.locals.hasClientCarerRelations = true;
    }else{
        res.locals.hasClientCarerRelations = false;
    }
    res.locals.existingClientCarerRelations = existingClientCarerRelations;
    res.locals.errorMessages = errorMessages;

    return next();
});

module.exports = router;