let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {

    let errorMessages = [];
    if (req.method === "POST") {

        if(req.body.email){

            let profileRepo = require("../../repository/profileRepo");

            let account = await profileRepo.getProfileByEmail(req.body.email);

            if(account){

                if(account.roles.includes("caretaker")){
                    if(req.user.id !== account.id){
                        let databaseManager = require("../../../core/database/database-manager");

                        let loadExistingClientCarerRelationRequest = databaseManager.createRequest("client_carer_relation").where("carer_id", "=", account.id).where("client_id","=",req.user.id);


                        let loadExistingClientCarerRelationResult = await databaseManager.executeRequest(loadExistingClientCarerRelationRequest);

                        if(loadExistingClientCarerRelationResult.result.length === 0){
                            let newRelation = {
                                client_id: req.user.id,
                                carer_id: account.id,
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
        }


    }

    res.locals.errorMessages = errorMessages;



    return next();
});

module.exports = router;