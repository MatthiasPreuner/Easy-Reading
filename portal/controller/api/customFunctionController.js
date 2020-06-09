let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.get('/', async function(req,res,next){
    res.locals.user  = req.user;
    res.locals.engineFunctionDescriptions = JSON.stringify(core.engineFunctionDescriptions);

    let b = req.query;

    if(req.query.id){
        let databaseManager = require("./../../../core/database/database-manager");

        let customFunctionsSearchRequest = databaseManager.createRequest("custom_function").where("id", "=", req.query.id);

        let customFunctionsSearchRequestResult = await databaseManager.executeRequest(customFunctionsSearchRequest);

        for (let i = 0; i < customFunctionsSearchRequestResult.result.length; i++) {

            res.locals.customFunctionToLoad = JSON.stringify(customFunctionsSearchRequestResult.result[i]);
        }
    }

    return next();


});

router.post('/',async function(req,res,next){

    try{


        let erfeSubmit = JSON.parse(req.body.erfeSubmit);

        if(erfeSubmit.type === "command"){

            if(erfeSubmit.command === "new"){
                return res.redirect('/client/function-editor');
            }else if(erfeSubmit.command === "exit"){

                return res.redirect('/client/function-overview');
            }

        }else if(erfeSubmit.type === "functionSubmit"){

            let customFunctionConfiguration = erfeSubmit.functionCode;



            customFunctionConfiguration.function_code = JSON.stringify(customFunctionConfiguration.json);
            customFunctionConfiguration.creator = req.user.id;

            let databaseManager = require("./../../../core/database/database-manager");

            if(req.body.erfeFunctionId){

                let updateFunctionRequest = databaseManager.createRequest('custom_function').update(customFunctionConfiguration).where("id", "=", req.body.erfeFunctionId);
                let updateFunctionRequestResult = await databaseManager.executeRequest(updateFunctionRequest);
            }else{
                let saveFunctionRequest = databaseManager.createRequest('custom_function').insert(customFunctionConfiguration);
                let saveFunctionRequestResult = await databaseManager.executeRequest(saveFunctionRequest);

            }
        }



    }catch (error){
        console.log(error);
    }


    return res.redirect('/client/function-overview');
});





module.exports = router;