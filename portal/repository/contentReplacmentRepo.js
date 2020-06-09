const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {

    getContentReplacementsByUserId : async (id) => {

        let loadActiveContentReplacementRequest = databaseManager.createRequest("content_replacement").where("pid", "=", id);
        let loadActiveContentReplacementResult = await databaseManager.executeRequest(loadActiveContentReplacementRequest);

        return loadActiveContentReplacementResult.result;
    },

    getContentReplacementsById : async (id) => {
        let loadActiveContentReplacementRequest = databaseManager.createRequest("content_replacement").where("id", "=", id);
        let loadActiveContentReplacementResult = await databaseManager.executeRequest(loadActiveContentReplacementRequest);
        if(loadActiveContentReplacementResult.result.length > 0){
            return loadActiveContentReplacementResult.result[0];
        }

    }
};
