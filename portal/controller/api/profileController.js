module.exports = {

    updateUserInterface: async (req, res, next) => {
        try {

            if (!req.body || (!req.body.id && !req.user.id) || !req.body.config) {
                return res.sendStatus(401).end()
            }

            let id = req.user.id;
            if (req.body.id) {
                id = req.body.id;
            }

            let config = req.body.config;
            let userInterfaceType = "";
            for (let i = 0; i < config.length; i++) {

                if (config[i].name === "userInterfaceType") {
                    userInterfaceType = config[i].value;
                    break;
                }
            }

            let uiConfig = {};
            for (let i = 0; i < config.length; i++) {
                if (config[i].name !== "userInterfaceType") {

                    let propertyInfo = config[i].name.split("_");
                    if (propertyInfo[1] === userInterfaceType) {
                        uiConfig[propertyInfo[2]] = config[i].value;
                    }
                }
            }
            const core = require("../../../core/core");
            const databaseManager = core.databaseManager;

            let loadActiveUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", id);

            let loadActiveUserInterfaceRequestResult = await databaseManager.executeRequest(loadActiveUserInterfaceRequest);

            if (loadActiveUserInterfaceRequestResult.result.length > 0) {

                for (let k = 0; k < loadActiveUserInterfaceRequestResult.result.length; k++) {

                    let loadUserInterfacesRequest = databaseManager.createRequest("ui_conf").where("ui_collection", "=", loadActiveUserInterfaceRequestResult.result[k].id);
                    let loadUserInterfacesRequestResult = await databaseManager.executeRequest(loadUserInterfacesRequest);
                    let userInterfaces = [];
                    for (let i = 0; i < loadUserInterfacesRequestResult.result.length; i++) {


                        let uiInfo = loadUserInterfacesRequestResult.result[i];

                        //Delete old configuration
                        let oldUserInterface = core.getUserInterface(uiInfo.ui_id);
                        if (oldUserInterface.hasConfigurationSchema()) {
                            let tableName = databaseManager.getConfigTableNameForComponent(oldUserInterface);

                            let userInterfaceConfigurationRequest = databaseManager.createRequest(tableName).where("id", "=", uiInfo.ui_conf_id).delete();
                            let userInterfaceConfigurationRequestResult = await databaseManager.executeRequest(userInterfaceConfigurationRequest);
                        }

                        //Insert new configuration
                        let newUserInterface = core.getUserInterface(userInterfaceType);
                        if (newUserInterface.hasConfigurationSchema()) {
                            let tableName = databaseManager.getConfigTableNameForComponent(newUserInterface);
                            let userInterfaceConfigurationRequest = databaseManager.createRequest(tableName).insert(uiConfig);
                            let userInterfaceConfigurationRequestResult = await databaseManager.executeRequest(userInterfaceConfigurationRequest);
                            uiInfo.ui_conf_id = userInterfaceConfigurationRequestResult.id;
                        }

                        //Update uiConf
                        uiInfo.ui_id = newUserInterface.id;
                        uiInfo.ui_version = newUserInterface.versionID;
                        let updateUiConfRequest = databaseManager.createRequest("ui_conf").update(uiInfo).where("id", "=", uiInfo.id);
                        let userInterfaceConfigurationRequestResult = await databaseManager.executeRequest(updateUiConfRequest);

                        let toolConfigurationRequest = databaseManager.createRequest("tool_conf").where("ui_conf_id", "=", uiInfo.id).orderBy("order_in_ui", "ASC");
                        let toolConfigurationRequestResult = await databaseManager.executeRequest(toolConfigurationRequest);
                        for (let j = 0; j < toolConfigurationRequestResult.result.length; j++) {

                            let toolConfiguration = toolConfigurationRequestResult.result[j];

                            if(toolConfiguration.layout_conf_id){
                                let layoutConfigurationDeleteRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForLayout(oldUserInterface)).where("id", "=", toolConfiguration.layout_conf_id).delete();
                                let layoutConfigurationDeleteRequestResult = await databaseManager.executeRequest(layoutConfigurationDeleteRequest);
                            }

                            toolConfiguration.layout_conf_id = null;
                            let updateToolConfigurationRequest = databaseManager.createRequest("tool_conf").update(toolConfiguration).where("id", "=", toolConfiguration.id);
                            let updateToolConfigurationRequestResult = await databaseManager.executeRequest(updateToolConfigurationRequest);
                        }
                    }
                }
            }

            let network = require("../../../core/network/network");
            await network.userUpdated(id);

            return res.status(200).json({action: "updated"});
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }
}