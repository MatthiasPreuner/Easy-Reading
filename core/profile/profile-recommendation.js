let databaseManager = require("../database/database-manager");
let Recommendation = require("./recommendation");



module.exports = {
    createRecommendation: async function (profile) {


        let profileStatistics = require("./profile-staticis");
        let profileBuilder = require("./profile-builder");
        await profileBuilder.loadProfileSupportCategories(profile);

        let usageStatistics = await profileStatistics.getUsageStatisticsForProfile(profile);

        let preferredSupportCategories = getPreferredSupportCategories(profile.supportCategories);

        let nonPreferredSupportCategories = getNonPreferredSupportCategories(profile.supportCategories);

        let unusedFunctions = await getCompatibleUnusedFunctions(profile);


        let totalUsageCount = 0;
        for (let i = 0; i < usageStatistics.length; i++) {

            totalUsageCount += usageStatistics[i].total_usage;
        }
        let functionCanBeRemoved = true;
        if (totalUsageCount < 100 || profile.userInterfaces[0].tools.length < 2 || usageStatistics.length === 0) {
            functionCanBeRemoved = false;
        } else if (usageStatistics[0].total_usage / totalUsageCount > 0.05) {
            //if the least used tool is still used more then 5%
            functionCanBeRemoved = false;
        }




        let functionCanBeAdded = true;
        if (unusedFunctions.length === 0) {
            functionCanBeAdded = false;
        }


        let recommendation = null;

        if (functionCanBeAdded && functionCanBeRemoved) {
            let rand = Math.floor(Math.random());

            if (rand === 0) {
                recommendation = getFunctionRemoveRecommendation(usageStatistics);
            } else {
                recommendation = getFunctionRecommendation(unusedFunctions, preferredSupportCategories, nonPreferredSupportCategories);
            }


        } else if (functionCanBeAdded) {
            recommendation = getFunctionRecommendation(unusedFunctions, preferredSupportCategories, nonPreferredSupportCategories);
        } else if (functionCanBeRemoved) {

            recommendation = getFunctionRemoveRecommendation(usageStatistics);

        }

        if (recommendation) {

            recommendation.createFunctionInformation(profile);

            return recommendation;
        }


    },

    createConfigurationForRecommendation: async function(recommendation,pid){
        try{

            let profileClass = require("./profile");
            let profile = new profileClass();
            let profileBuilder = require("./profile-builder");
            let core = require("./../core");

            const loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", pid);
            const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", pid);
            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            if (loadProfileRequestResult.result.length > 0) {
                profile.id = loadProfileRequestResult.result[0].id;
                profile.type = loadProfileRequestResult.result[0].type;
                profile.locale = loadProfileRequestResult.result[0].locale;

                //Loads stuff like busy animation and so on...
                await profileBuilder.loadActiveUserInterfaces(profile);
                await  profileBuilder.loadProfileSupportCategories(profile);

                profile.debugMode = core.debugMode;
                profile.userLoaded = true;

                let functionSupportCategories =  [];
                if(recommendation.functions.length){
                    let functionDescription = core.getFunctionDescription(recommendation.functions[0].engine.id,recommendation.functions[0].engine.version,recommendation.functions[0].id);

                    let profileSupportCategories = require("./profile-support-categories");
                    for(let i= 0; i < functionDescription.supportCategories.length; i++){
                        let scKeys = profileSupportCategories.getKeysForSupportCategory(functionDescription.supportCategories[i]);
                        functionSupportCategories.push(scKeys);

                    }
                }


                if(recommendation.result){


                    if(recommendation.type === "add"){

                        for(let i=0; i< recommendation.functions.length; i++){
                            let userInterface = core.getUserInterface(profile.userInterfaces[0].source.id,profile.userInterfaces[0].source.version);
                            let tool = core.createDefaultConfigurationFoFunctionWithID(recommendation.functions[i].engine.id,recommendation.functions[i].engine.version,recommendation.functions[i].id,userInterface,profile.supportCategories);
                            if(tool){
                                let toolInserted = false;
                                for(let j=0; j< profile.userInterfaces[0].tools.length; j++){



                                    if(profile.userInterfaces[0].tools[j].function.source.engine.id === tool.function.source.engine.id ){

                                        let engine = core.getEngine(profile.userInterfaces[0].tools[j].function.source.engine.id,profile.userInterfaces[0].tools[j].function.source.engine.version);
                                        let functionDescriptions = engine.getFunctions();
                                        for(let k=0; k < functionDescriptions.length; k++){
                                            if(functionDescriptions[k].id === profile.userInterfaces[0].tools[j].function.source.id){
                                                break;
                                            }else if(functionDescriptions[k].id === tool.function.source.id){

                                                profile.userInterfaces[0].tools.splice(j, 0, tool);
                                                toolInserted = true;
                                                break;
                                            }

                                        }
                                    }else if(profile.userInterfaces[0].tools[j].function.source.engine.id > tool.function.source.engine.id){

                                        profile.userInterfaces[0].tools.splice(j, 0, tool);
                                        toolInserted = true;
                                    }

                                    if(toolInserted){
                                        break;
                                    }
                                }


                                if(!toolInserted){
                                    profile.userInterfaces[0].tools.push(tool);
                                }

                            }
                        }

                        //Adjust profile
                        if(recommendation.recommendationMethod === "low_preference_random_usage"){
                            updateProfileSupportCategories(profile,functionSupportCategories,10);
                        }else{

                            updateProfileSupportCategories(profile,functionSupportCategories,5);
                        }

                    }else if(recommendation.type === "remove"){
                        for(let i=0; i< recommendation.functions.length; i++){
                            for(let j=0; j< profile.userInterfaces[0].tools.length; j++){
                                     if (profile.userInterfaces[0].tools[j].function.source.id === recommendation.functions[i].id &&
                                        profile.userInterfaces[0].tools[j].function.source.engine.id === recommendation.functions[i].engine.id &&
                                         profile.userInterfaces[0].tools[j].function.source.engine.version === recommendation.functions[i].engine.version ) {

                                         profile.userInterfaces[0].tools.splice(j, 1);
                                         break;
                                }
                            }
                        }

                        //Adjust profile
                        updateProfileSupportCategories(profile,functionSupportCategories,-5);



                    }
                }else{

                    //User rejected recommendation

                    updateProfileSupportCategories(profile,functionSupportCategories,-1);


                }

                await profileBuilder.saveUserInterfaceConfiguration(profile, true);
                await profileBuilder.saveProfileSupportCategories(profile);

                let network = require("../network/network");
                network.updateProfileForConnectedClients(profile);

            }
        }catch (e){
            console.log(e);
        }
    }



};

function updateProfileSupportCategories(profile, functionSupportCategories, value){

    if(!Array.isArray(functionSupportCategories)){
        return;
    }

    if(functionSupportCategories.length === 0){
        return;
    }

    let counts = {};
    for (let i = 0; i < functionSupportCategories.length; i++) {

        let categoryCount = 1;
        if(counts[functionSupportCategories[i].category+"__"+functionSupportCategories[i].subCategory] ){
            categoryCount = counts[functionSupportCategories[i].category+"__"+functionSupportCategories[i].subCategory]+1;
        }
        functionSupportCategories[i].count = categoryCount;
        counts[functionSupportCategories[i].category+"__"+functionSupportCategories[i].subCategory] = functionSupportCategories[i];
    }

    Object.keys(counts).forEach(function(key,index) {

        let functionSupportCategory = counts[key];
        let changeValue =  Math.round(value*(functionSupportCategory.count/functionSupportCategories.length));

        if(changeValue === 0){
            if(value > 0){
                changeValue = 1;
            }else{
                changeValue = -1;
            }
        }

        profile.supportCategories[functionSupportCategory.category][functionSupportCategory.subCategory].preference+=changeValue;

        if( profile.supportCategories[functionSupportCategory.category][functionSupportCategory.subCategory].preference > 100){
            profile.supportCategories[functionSupportCategory.category][functionSupportCategory.subCategory].preference = 100;
        }

        if( profile.supportCategories[functionSupportCategory.category][functionSupportCategory.subCategory].preference < 0){
            profile.supportCategories[functionSupportCategory.category][functionSupportCategory.subCategory].preference = 0;
        }

    });


}

function getFunctionRecommendation(unusedFunctions, preferredSupportCategories, nonPreferredSupportCategories) {

    let rand = Math.floor(Math.random() * 10);

    let recommendation = null;
    if (rand <= 1) {
        recommendation = getLowPreferenceFunction(unusedFunctions, nonPreferredSupportCategories);

        if (!recommendation) {
            let rand = Math.floor(Math.random());
            if (rand === 0) {
                recommendation = getHighPreferenceFunctionWithHighUsage(unusedFunctions, preferredSupportCategories);
            } else {
                recommendation = getHighPreferenceFunctionWithLowUsage(unusedFunctions, preferredSupportCategories);
            }
        }
    } else {
        if (rand <= 5) {
            recommendation = getHighPreferenceFunctionWithHighUsage(unusedFunctions, preferredSupportCategories);

        } else {
            recommendation = getHighPreferenceFunctionWithLowUsage(unusedFunctions, preferredSupportCategories);
        }
        if (!recommendation) {
            recommendation = getLowPreferenceFunction(unusedFunctions, nonPreferredSupportCategories);
        }
    }

    return recommendation;

}

function getFunctionRemoveRecommendation(usageStatistics) {
    let leastUsedFunctions = [];
    leastUsedFunctions.push(usageStatistics[0]);

    for (let i = 1; i < usageStatistics.length; i++) {

        if (usageStatistics[i].total_usage === usageStatistics[0].total_usage) {
            leastUsedFunctions.push(usageStatistics[i]);
        }

    }

    let rand = Math.floor(Math.random() * leastUsedFunctions.length);

    let core = require("../core");

   // let func = core.getFunction(usageStatistics[rand].engine_id, null, usageStatistics[rand].function_id);
   // return new Recommendation("remove", [func]);

    let functions = getFunctions(usageStatistics[rand].engine_id, null, usageStatistics[rand].function_id);
    return new Recommendation("remove", functions,"least_used");


}

function getHighPreferenceFunctionWithHighUsage(unusedFunctions, preferredSupportCategories) {
    for (let f = 0; f < unusedFunctions.length; f++) {
        for (let k = 0; k < unusedFunctions[f].func.supportCategories.length; k++) {

            for (let i = 0; i < preferredSupportCategories.length; i++) {

                for (let j = 0; j < preferredSupportCategories[i].supportCategories.length; j++) {

                    let subCategoryID = preferredSupportCategories[i].supportCategories[j].supportCategory + "_" + preferredSupportCategories[i].supportCategories[j].subCategory;
                    if (unusedFunctions[f].func.supportCategories[k] === subCategoryID) {

                        let core = require("../core");

                        let functions = getFunctions(unusedFunctions[f].engineId, unusedFunctions[f].engineVersion, unusedFunctions[f].functionId);
                        return new Recommendation("add", functions,"high_preference_high_overall_usage");
                    }


                }


            }
        }

    }

}

function getHighPreferenceFunctionWithLowUsage(unusedFunctions, preferredSupportCategories) {
    for (let f = unusedFunctions.length - 1; f >= 0; f--) {
        for (let k = 0; k < unusedFunctions[f].func.supportCategories.length; k++) {

            for (let i = 0; i < preferredSupportCategories.length; i++) {

                for (let j = 0; j < preferredSupportCategories[i].supportCategories.length; j++) {

                    let subCategoryID = preferredSupportCategories[i].supportCategories[j].supportCategory + "_" + preferredSupportCategories[i].supportCategories[j].subCategory;
                    if (unusedFunctions[f].func.supportCategories[k] === subCategoryID) {

                        let core = require("../core");
                        let functions = getFunctions(unusedFunctions[f].engineId, unusedFunctions[f].engineVersion, unusedFunctions[f].functionId);
                        return new Recommendation("add", functions,"high_preference_low_overall_usage");
                    }


                }


            }
        }

    }
}


function getLowPreferenceFunction(unusedFunctions, nonPreferredSupportCategories) {

    let shuffledFunctions = shuffle(unusedFunctions);
    for (let i = 0; i < shuffledFunctions.length; i++) {
       for(let j=0; j< shuffledFunctions[i].func.supportCategories.length; j++){
           for (let k = 0; k < nonPreferredSupportCategories.length; k++) {

               let subCategoryID = nonPreferredSupportCategories[k].supportCategory + "_" + nonPreferredSupportCategories[k].subCategory;

               if (shuffledFunctions[i].func.supportCategories[j] === subCategoryID) {

                   let core = require("../core");
                   let functions = getFunctions(shuffledFunctions[i].engineId, shuffledFunctions[i].engineVersion, shuffledFunctions[i].functionId);
                   return new Recommendation("add", functions,"low_preference_random_usage");
               }

           }
       }
    }

}


function getFunctions(engineID, engineVersion,functionID){
    let core = require("../core");
    let func = core.getFunction(engineID,engineVersion,functionID);
    if(func.bundle){

        let bundleFunctions = [];
        let engine = core.getEngine(func.engine.id,func.engine.version);
        let functions = engine.getFunctions();

        for(let i=0; i < functions.length; i++){

            if(functions[i].bundle){
                if(functions[i].bundle.bundleId === func.bundle.bundleId){
                    bundleFunctions.push(core.getFunction(func.engine.id, func.engine.version, functions[i].id));
                }
            }

        }

        return bundleFunctions;

    }

    return [func];

}

function getPreferredSupportCategories(supportCategories) {
    let preferredSupportCategories = [];
    Object.keys(supportCategories).forEach(function (categoryName, index) {

        let category = supportCategories[categoryName];
        Object.keys(category).forEach(function (subcategoryName, index) {

            if (category[subcategoryName].preference >= 50) {

                preferredSupportCategories.push({
                    supportCategory: categoryName,
                    subCategory: subcategoryName,
                    preference: category[subcategoryName].preference + Math.floor(Math.random() * 4),
                });
            }
        });
    });

    preferredSupportCategories.sort(function (a, b) {
        if (a.preference > b.preference) {
            return -1;
        }
        if (a.preference < b.preference) {
            return 1;
        }
        return 0;
    });

    let clusteredSupportCategories = [];

    for (let i = 0; i < preferredSupportCategories.length; i++) {
        if (clusteredSupportCategories.length) {

            if (clusteredSupportCategories[clusteredSupportCategories.length - 1].preference === preferredSupportCategories[i].preference) {

                clusteredSupportCategories[clusteredSupportCategories.length - 1].supportCategories.push(preferredSupportCategories[i]);
                continue;
            }
        }

        clusteredSupportCategories.push({
            preference: preferredSupportCategories[i].preference,
            supportCategories: [preferredSupportCategories[i]]
        });
    }
    //Shuffle categories
    for (let i = 0; i < clusteredSupportCategories.length; i++) {
        clusteredSupportCategories[i].supportCategories = shuffle(clusteredSupportCategories[i].supportCategories);
    }

    return clusteredSupportCategories;

}

function getNonPreferredSupportCategories(supportCategories) {
    let nonPreferredSupportCategories = [];
    Object.keys(supportCategories).forEach(function (categoryName, index) {

        let category = supportCategories[categoryName];
        Object.keys(category).forEach(function (subcategoryName, index) {

            if (category[subcategoryName].preference < 50) {

                nonPreferredSupportCategories.push({
                    supportCategory: categoryName,
                    subCategory: subcategoryName,
                    preference: category[subcategoryName].preference + Math.floor(Math.random() * 10),
                });
            }
        });
    });

    nonPreferredSupportCategories.sort(function (a, b) {
        if (a.preference > b.preference) {
            return -1;
        }
        if (a.preference < b.preference) {
            return 1;
        }
        return 0;
    });

    return shuffle(nonPreferredSupportCategories);
}

async function getCompatibleUnusedFunctions(profile) {
    let core = require("../core");

    let unusedFunctions = [];
    let tools = profile.userInterfaces[0].tools;
    for (let i = 0; i < core.allFunctions.length; i++) {

        if (core.allFunctions[i].func.visibleInConfiguration) {
            for (let j = 0; j < tools.length; j++) {

                if (core.allFunctions[i].func.supportedLanguages.length > 0) {
                    if (typeof profile.locale !== "undefined") {
                        if (!core.allFunctions[i].func.supportedLanguages.includes(profile.locale)) {
                            continue;
                        }
                    }
                }

                let functionID = tools[j].function.source.id;
                let engineID = tools[j].function.source.engine.id;
                let version = tools[j].function.source.engine.version;

                if (tools[j].function.source.id === core.allFunctions[i].functionId &&
                    tools[j].function.source.engine.id === core.allFunctions[i].engineId &&
                    tools[j].function.source.engine.version === core.allFunctions[i].engineVersion
                ) {
                    break;
                }

                if (j === tools.length - 1) {
                    unusedFunctions.push(core.allFunctions[i]);
                }
            }

        }


    }
    let databaseManager = require("../database/database-manager");
    for (let i = 0; i < unusedFunctions.length; i++) {
        let result = await databaseManager.executeSql("SELECT SUM(total_usage)  globalUsage FROM `function_usage_entry` WHERE `engine_id` ='" + unusedFunctions[i].engineId + "' AND `function_id` = '" + unusedFunctions[i].functionId + "'");

        if (result.result[0].globalUsage) {
            unusedFunctions[i].gloablUsage = result.result[0].globalUsage;
        } else {
            unusedFunctions[i].gloablUsage = 0;
        }

    }

    unusedFunctions.sort(function (a, b) {
        if (a.gloablUsage > b.gloablUsage) {
            return -1;
        }
        if (a.gloablUsage < b.gloablUsage) {
            return 1;
        }
        return 0;
    });


    return unusedFunctions;


}

function shuffle(arrayToShuffle) {
    let a = [];
    for (let i = 0; i < arrayToShuffle.length; i++) {
        a.push(arrayToShuffle[i]);
    }
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}