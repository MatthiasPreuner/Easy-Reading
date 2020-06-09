const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {


    getProfileByEmail: async (email) => {

        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", email);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        if (loadProfileRequestResult.result.length > 0) {

            let profile = loadProfileRequestResult.result[0];

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id);

            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            return profile;
        }


    },
    getProfileId: async (id) => {
        let loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        if (loadProfileRequestResult.result.length > 0) {

            let profile = loadProfileRequestResult.result[0];

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id);

            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            return profile;
        }
    },

    getProfileLanguage: async (id) => {
        const sql = `SELECT locale FROM profile
                     WHERE id = ?
                     `;

        const sqlParameters = [id];

        const profileResult = await databaseManager.executeSql(sql, sqlParameters);

        if (profileResult.result.length) {
            return profileResult.result[0]['locale'];
        } else {
            return "en";
        }
    },

};