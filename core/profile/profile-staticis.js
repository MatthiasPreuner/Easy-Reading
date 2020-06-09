module.exports = {
    updateFunctionUsageStatistics: async function (profile, req) {


        let databaseManager = require("./../database/database-manager");


        try {

            //Do not store automatic requests
            if (req.requestInfo.automaticRequest || req.requestInfo.reasonerTriggered) {
                return;
            }

            //Only count if a tool has been used once on a site...
            if (req.requestInfo.toolUsage.toolCount > 1) {
                return;
            }


            let tool = profile.userInterfaces[req.requestInfo.uiIndex].tools[req.requestInfo.toolIndex];

            let core = require("../core");

            let entryRequest = databaseManager.createRequest("function_usage_entry").where("pid", "=", profile.id).where("engine_id", "=", tool.function.source.engine.id).where("function_id", "=", tool.function.source.id);

            let entryRequestResult = await databaseManager.executeRequest(entryRequest);

            if (entryRequestResult.result.length) {

                entryRequestResult.result[0].total_usage++;

                let updateEntryRequest = databaseManager.createRequest("function_usage_entry").update(entryRequestResult.result[0]).where("id", "=", entryRequestResult.result[0].id);
                await databaseManager.executeRequest(updateEntryRequest);

            } else {

                let newUsageEntry = {
                    pid: profile.id,
                    engine_id: tool.function.source.engine.id,
                    function_id: tool.function.source.id,
                    total_usage: 1,
                };


                let insertNewEntryRequest = databaseManager.createRequest("function_usage_entry").insert(newUsageEntry);
                await databaseManager.executeRequest(insertNewEntryRequest);

            }


        } catch (e) {

            console.log(e);
        }


    },
    getUsageStatisticsForProfile: async function (profile) {
        let databaseManager = require("./../database/database-manager");

        let entryRequest = databaseManager.createRequest("function_usage_entry").where("pid", "=", profile.id).orderBy("total_usage", "DESC");
        let entryRequestResult = await databaseManager.executeRequest(entryRequest);


        let currentTools = profile.userInterfaces[0].tools;

        let usageStatistics = [];
        for (let i = 0; i < currentTools.length; i++) {
            let entryFound = false;
            for (let j = 0; j < entryRequestResult.result.length; j++) {

                if (currentTools[i].function.source.id === entryRequestResult.result[j].function_id &&
                    currentTools[i].function.source.engine.id === entryRequestResult.result[j].engine_id) {
                    entryFound = true;

                    usageStatistics.push(entryRequestResult.result[j]);
                    break;
                }
            }

            if (!entryFound) {
                usageStatistics.push({
                    "pid": profile.id,
                    "engine_id": currentTools[i].function.source.engine.id,
                    "function_id": currentTools[i].function.source.id,
                    "total_usage": 0
                });
            }

        }


        usageStatistics.sort(function (a, b) {
            if (a.total_usage < b.total_usage) {
                return -1;
            }
            if (a.total_usage > b.total_usage) {
                return 1;
            }
            return 0;
        });

        return usageStatistics;


    },
    resetUsageStatisticsForProfile: async function (profile) {
        let databaseManager = require("./../database/database-manager");
        let entryDeleteRequest = databaseManager.createRequest("function_usage_entry").where("pid", "=", profile.id).delete();
        await databaseManager.executeRequest(entryDeleteRequest);

    }


};