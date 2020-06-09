let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {

    if(!req.isAuthenticated()) {
        return res.redirect('/client/welcome');
    }

    let databaseManager = require("./../../../core/database/database-manager");

    let customFunctionsSearchRequest = databaseManager.createRequest("custom_function").where("creator", "=", req.user.id);

    let customFunctionsSearchRequestResult = await databaseManager.executeRequest(customFunctionsSearchRequest);

    let profile = core.network.getProfileWithID(req.user.id);


    if (req.method === "POST") {
        let functionID = Object.keys(req.body);
        for (let i = 0; i < functionID.length; i++) {
            let id = parseInt(functionID[i].substring(3));

            let operation = req.body[functionID[i]];
            if(operation === "activate"){

                let combinedFunctionAlreadyLoaded = false;
                for(let k=0; k < profile.userInterfaces[0].tools.length; k++) {
                    if (profile.userInterfaces[0].tools[k].function.source.type === "CombinedFunction") {

                        if (profile.userInterfaces[0].tools[k].function.source.id === id) {
                            combinedFunctionAlreadyLoaded = true;
                        }
                    }
                }

                if(!combinedFunctionAlreadyLoaded){
                    for (let l = 0; l < customFunctionsSearchRequestResult.result.length; l++) {

                        if (id === customFunctionsSearchRequestResult.result[l].id) {
                            let ioType = rootRequire("core/IOtypes/iotypes");

                            let engineFunction = require("../../../core/components/engines/base/engine-function");
                            let customFunction = customFunctionsSearchRequestResult.result[l];
                            let functionCode = JSON.parse(customFunction.function_code);
                            let localFunction = new engineFunction.CombinedFunction(customFunction.id,functionCode.functions, functionCode.connections, customFunction.title, customFunction.description, "images/custom-function.png");


                            let combinedFunctionValidator = require("../../../core/components/engines/base/combined-function-validator");

                            if(!combinedFunctionValidator.validateConfiguration(localFunction)){
                                res.locals.errorMessage = "This function is not valid! A valid function needs at least one engine that is connected with start and end!";
                            }else{
                                let websocketConnection = core.network.getWebSocketConnectionWithID(req.user.id);
                                if(websocketConnection){
                                    websocketConnection.customFunctions.push(localFunction);
                                }

                                let uiConfig =  profile.userInterfaces[0].source;
                                let overlay = core.getUserInterface(uiConfig.id, uiConfig.version);

                                let defaultConfig = core.getDefaultConfigurationForFunction(localFunction,overlay);
                                //Normalize image

                                defaultConfig.function.source.defaultIconURL = websocketConnection.url+defaultConfig.function.source.defaultIcon;
                                profile.userInterfaces[0].tools.push(defaultConfig);

                                let profileBuilder = require("../../../core/profile/profile-builder");
                                profileBuilder.normalizeRemoteAssetDirectoryPaths(profile,websocketConnection.url);

                                let network = require("../../../core/network/network");
                                network.updateProfileForConnectedClients(profile,true);
                            }


                        }
                    }
                }



            }else if(operation === "deactivate" || operation === "delete"){

                for(let k=0; k < profile.userInterfaces[0].tools.length; k++){
                    if(profile.userInterfaces[0].tools[k].function.source.type === "CombinedFunction"){

                        if(profile.userInterfaces[0].tools[k].function.source.id === id){
                            let webSocketConnection = profile.webSocketConnection;

                            if(!webSocketConnection){
                                webSocketConnection = core.network.getWebSocketConnectionWithID(req.user.id);
                            }
                            if(webSocketConnection){

                              for(let l=0; l < webSocketConnection.customFunctions.length; l++){
                                  if(webSocketConnection.customFunctions[l].id === id){
                                      webSocketConnection.customFunctions.splice(l, 1)
                                  }
                              }
                            }

                            profile.userInterfaces[0].tools.splice(k, 1);

                            let network = require("../../../core/network/network");
                            network.updateProfileForConnectedClients(profile,true);
                            break;
                        }

                    }
                }

                if(operation === "delete"){

                    let deleteFunctionRequest = databaseManager.createRequest("custom_function").where("id", "=", id).delete();
                    let deleteFunctionRequestResult = await databaseManager.executeRequest(deleteFunctionRequest);


                    for(let i=0; i < customFunctionsSearchRequestResult.result.length; i++){
                        if(customFunctionsSearchRequestResult.result[i].id === id){
                            customFunctionsSearchRequestResult.result.splice(i, 1);
                            break;
                        }
                    }


                }

            }


        }
    }

    let customFunctions = [];




    for (let i = 0; i < customFunctionsSearchRequestResult.result.length; i++) {

        let functionActive = false;
        for(let k=0; k < profile.userInterfaces[0].tools.length; k++){
            if(profile.userInterfaces[0].tools[k].function.source.type === "CombinedFunction"){

                if(profile.userInterfaces[0].tools[k].function.source.id === customFunctionsSearchRequestResult.result[i].id){
                    functionActive = true;
                }

            }
        }

        customFunctions.push({
            id: customFunctionsSearchRequestResult.result[i].id,
            title: customFunctionsSearchRequestResult.result[i].title,
            description: customFunctionsSearchRequestResult.result[i].description,
            active: functionActive,
        });

    }

    res.locals.cutstomFunctions = customFunctions;


    return next();


});


module.exports = router;