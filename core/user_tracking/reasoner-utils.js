let reasonerUtil = {

    models: ['q_learning', 'double_q_learning', 'rnn'],
    default_model: 'q_learning',
    default_hyperparams: {
        alpha: 0.01, // Step size
        gamma: 0.1,
        eps: 0.2,
        eps_decay: 0.9,
        ucb: 0.0,
        x_offset: 0,
        y_offset: -70,
    },

    loadProfileReasoner: async function (profile, enabled='enabled', load_params=true, return_default=true) {
        try {
            let reasoners = [];
            let databaseManager = require("../database/database-manager");
            let loadExistingReasoners = databaseManager.createRequest("profile_reasoner").where("pid", "=", profile.id);
            if (enabled === 'enabled') {
                loadExistingReasoners.where("enabled", "=", true);
            } else if (enabled === 'disabled') {
                loadExistingReasoners.where("enabled", "=", false);
            }
            let loadExistingReasonersResult = await databaseManager.executeRequest(loadExistingReasoners);
            if(loadExistingReasonersResult.result.length > 0) {
                for (let i=0; i<loadExistingReasonersResult.result.length; i++) {
                    let res = loadExistingReasonersResult.result[i];
                    let reasoner = {};
                    reasoner['id'] = res.id;
                    reasoner['pid'] = res.pid;
                    reasoner['model_type'] = res.model_type;
                    reasoner['enabled'] = res.enabled;
                    reasoner['hyperparams'] = JSON.parse(res.hyperparams);
                    if (load_params) {
                        reasoner['params'] = await this.loadReasonerParams(res.id);
                    }
                    reasoners.push(reasoner);
                }
            } else if (return_default) {
                reasoners.push({
                    model_type: this.default_model,
                    enabled: false,
                    hyperparams: this.default_hyperparams,
                    params: {},
                });
            }
            return reasoners;
        } catch (e) {
            console.log('Error loading reasoner: ' + e);
        }
    },

    createNewUserReasoner: async function(profile, type, enabled=true) {
        let rid = -1;
        if (this.models.includes(type)) {
            let reasonerRelation = {
                enabled: enabled,
                model_type: type,
                hyperparams: this.default_hyperparams,
            };
            rid = await this.persistReasoner(reasonerRelation, profile);
        } else {
            console.log('Can\'t create reasoner. Type ' + type + ' does not exist.');
        }
        return rid;
    },

    enableReasonerForUser: async function(profile, type, create_if_not_exists=true) {
        let user_reasoners = await this.loadProfileReasoner(profile, 'all', false, false);
        let rid = -1;
        for (let i=0; i<user_reasoners.length; i++) {
            let r = user_reasoners[i];
            if (r.model_type === type) {
                rid = r.id;
                await this.changeReasonerStatus(rid, 'enabled');
            } else {
                await this.changeReasonerStatus(r.id, 'disabled');
            }
        }
        if (rid < 0 && create_if_not_exists) {
            await this.createNewUserReasoner(profile, type);
        }
    },

    disableUserReasoners: async function(profile) {
        let user_reasoners = await this.loadProfileReasoner(profile, 'all', false, false);
        for (let i=0; i<user_reasoners.length; i++) {
            let r = user_reasoners[i];
            await this.changeReasonerStatus(r.id, 'disabled');
        }
    },

    loadReasonerParams: async function (rid) {
        let params = {};
        if (rid > 0) {
            let databaseManager = require("../database/database-manager");
            let loadReasonerParams = databaseManager.createRequest("profile_reasoner_params").where("rid", "=", rid);
            let loadReasonerParamsResult = await databaseManager.executeRequest(loadReasonerParams);
            if (loadReasonerParamsResult.result.length > 0) {
                params = JSON.parse(loadReasonerParamsResult.result[0].params);
            }
        }
        return params;
    },

    persistReasoner: async function (reasoner_data, profile) {
        let new_id = -1;
        if ('id' in profile) {
            let enabled = true;
            if ('enabled' in reasoner_data) {
                enabled = reasoner_data.enabled;
            }
            let databaseManager = require("../database/database-manager");
            let reasonerRelation = {
                pid: profile.id,
                enabled: enabled,
                model_type: reasoner_data.model_type,
                hyperparams: JSON.stringify(reasoner_data.hyperparams),
            };
            let paramsRelation = null;
            let send_id = false;
            if ('id' in reasoner_data && reasoner_data.id > 0) {
                reasonerRelation.id = reasoner_data.id;
                if ('params' in reasoner_data) {
                    paramsRelation = {
                        rid: reasoner_data.id,
                        params: JSON.stringify(reasoner_data.params),
                    };
                }
            } else {
                send_id = true;
            }
            let reasonerRelationRequest = databaseManager.createRequest("profile_reasoner").insertOrUpdate(reasonerRelation);
            let reasonerInsertResult = await databaseManager.executeRequest(reasonerRelationRequest);
            if (send_id && typeof reasonerInsertResult === "object" && reasonerInsertResult !== null
                && 'id' in reasonerInsertResult) {
                paramsRelation = {
                    rid: reasonerInsertResult.id,
                    params: "{}",
                };
                new_id = reasonerInsertResult.id;
            }
            if (paramsRelation !== null) {
                let paramsRelationRequest = databaseManager.createRequest("profile_reasoner_params").insert(paramsRelation);
                await databaseManager.executeRequest(paramsRelationRequest);
            }
        } else {
            console.log("persistReasoner: no user ID given!");
        }
        return new_id;
    },

    persistUserReasonerParams: async function (params, profile) {
        let insertResult = -1;
        if (!'id' in profile) {
            console.log("persistUserReasonerParams: no user ID given!");
            return insertResult;
        }
        if (params === null || typeof params !== "object") {
            console.log("persistUserReasonerParams: wrong parameters given!");
            return insertResult;
        }
        let reasoner_params = {};
        let reasoners = await this.loadProfileReasoner(profile, 'enabled', false, false);
        if (reasoners.length > 0) {
            let reasoner = reasoners[0];
            if ('rid' in params) {
                if (reasoner.id !== Number(params['rid'])) {
                    console.log('Can\'t persist reasoner! Given rid ' + params['rid'] + ' does not match user rid ' +
                    reasoner.id);
                    return insertResult;
                }
            }
            if ('params' in params) {
                reasoner_params = params.params;
            } else {
                reasoner_params = params;
            }
            insertResult = await this.persistReasonerParams(reasoner_params, reasoner.id);
        } else {
            console.log("persistUserReasonerParams: user has no active reasoner!");
        }
        return insertResult;
    },

    persistReasonerParams: async function (params, rid) {
        if (rid > 0) {
            let databaseManager = require("../database/database-manager");
            let loadReasonerRequest = databaseManager.createRequest("profile_reasoner").where("id", "=", rid);
            let loadReasonerRequestResult = await databaseManager.executeRequest(loadReasonerRequest);
            if(loadReasonerRequestResult.result.length > 0) {
                let insert_params = params;
                if (params === null) {
                    insert_params = {};
                }
                let paramsRelation = {
                    rid: rid,
                    params: JSON.stringify(insert_params),
                };
                let loadParamsRequest = databaseManager.createRequest("profile_reasoner_params").where("rid", "=", rid);
                let loadParamsRequestResult = await databaseManager.executeRequest(loadParamsRequest);
                if(loadParamsRequestResult.result.length === 0) {
                    let paramsRelationRequest = databaseManager.createRequest("profile_reasoner_params").insert(paramsRelation);
                    return await databaseManager.executeRequest(paramsRelationRequest);
                } else if (loadParamsRequestResult.result.length === 1) {
                    let paramsRelationRequest = databaseManager.createRequest("profile_reasoner_params")
                        .where("id", "=", loadParamsRequestResult.result[0].id).update(paramsRelation);
                    return await databaseManager.executeRequest(paramsRelationRequest);
                } else {
                    console.log("Error persisting reasoner parameters: more than one parameter set found for rid " + rid);
                }
            } else {
                console.log('persistReasonerParams: reasoner with rid ' + rid + ' does not exist!');
            }
        }
        return -1;
    },

    /**
     * Changes the enabled/disabled status for the given reasoner
     */
    changeReasonerStatus: async function (rid, status) {
        try {
            if (rid > 0) {
                let databaseManager = require("../database/database-manager");
                let enabled = false;
                if (status === 'enabled') {
                    enabled = true;
                }
                let loadExistingReasoners = databaseManager.createRequest("profile_reasoner").where("id", "=", rid);
                let loadExistingReasonersResult = await databaseManager.executeRequest(loadExistingReasoners);
                if (loadExistingReasonersResult.result.length > 0) {
                    let r = loadExistingReasonersResult.result[0];
                    r['enabled'] = enabled;
                    let paramsRelationRequest = databaseManager.createRequest("profile_reasoner")
                        .where("id", "=", rid).update(r);
                    await databaseManager.executeRequest(paramsRelationRequest);
                } else {
                    console.log('changeReasonerStatus: reasoner with id ' + rid + ' does not exist!');
                }
            }
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * Return the indices of the preferred function of the given profile for the given inputType
     */
    preferredTool: async function (profile, input) {
        let best_tool = null;
        let idx = [];
        let highest_usage = -1;
        let u_stats = rootRequire("core/profile/profile-staticis");
        let u_tool_stats = await u_stats.getUsageStatisticsForProfile(profile);
        // Build dictionary of tool usages for easier later retrieval
        let tool_usages = {};
        for (let i=0; i<u_tool_stats.length; i++) {
            let tool = u_tool_stats[i];
            if ('engine_id' in tool) {
                if (!(tool.engine_id in tool_usages)) {
                    tool_usages[tool.engine_id] = {};
                }
                if ('function_id' in tool && 'total_usage' in tool) {
                    tool_usages[tool.engine_id][tool.function_id] = Number(tool.total_usage);
                }
            }
        }
        for (let i=0; i<profile.userInterfaces.length; i++) {
            let ui = profile.userInterfaces[i];
            for (let j=0; j<ui.tools.length; j++) {
                let tool = ui.tools[j];
                let toolInputs = tool.function.source.inputTypes;
                for (let k=0; k<toolInputs.length; k++) {
                    if (toolInputs[k].inputType === input.type) {  // Only consider tools with compatible input types
                        let toolCount = 0;
                        let engine_id = tool.function.source.engine.id;
                        if (engine_id in tool_usages) {
                            let function_id = tool.function.source.id;
                            if (function_id in tool_usages[engine_id]) {
                                toolCount = tool_usages[engine_id][function_id];
                            }
                        }
                        if (toolCount > highest_usage) {
                            idx = [[i, j]];
                            highest_usage = toolCount;
                        } else if (toolCount === highest_usage) {
                            idx.push([i, j]);
                        }
                    }
                }
            }
        }
        if (idx.length > 0) {
            best_tool = idx[Math.floor(Math.random()*idx.length)];  // Pick randomly in ties
        }
        return best_tool;
    },
};

module.exports = reasonerUtil;