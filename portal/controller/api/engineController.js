const core = rootRequire("core/core");
const databaseManager = core.databaseManager;
const profileBuilder = rootRequire("core/profile/profile-builder");
const profileRepo = require("../../repository/profileRepo");
const widgets = [...rootRequire("core/core").widgets];
const presentations = [...rootRequire("core/core").presentations];

function loadFunctions(userInterfaceConfig, engineFunctionConfigObjects) {
    for (const engineFunction of engineFunctionConfigObjects) {
        const defaultConfigurationForEngineFunctions = core.createDefaultConfigurationForEngine(engineFunction.engineId, engineFunction.engineVersion, core.getUserInterface(userInterfaceConfig.source.id));
        const defaultConfigurationForEngineFunction = defaultConfigurationForEngineFunctions.filter(func => func.function.source.id === engineFunction.id);

        if (defaultConfigurationForEngineFunction.length > 0 && defaultConfigurationForEngineFunction[0].function.configuration) {
            const engineConfigProperties = Object.keys(engineFunction.config[0]).filter(property => property !== "id");

            for (const engineConfigProperty of engineConfigProperties) {
                defaultConfigurationForEngineFunction[0].function.configuration[engineConfigProperty] = engineFunction.config[0][engineConfigProperty];
            }
        }

        if (defaultConfigurationForEngineFunction.length > 0 && engineFunction.widget!=null) {
            for (let wIndex = 0; wIndex < widgets.length; wIndex++) {
                var widget = widgets[wIndex];

                for (let vIndex = 0; vIndex < widget.versions.length; vIndex++) {
                    const version = widget.versions[vIndex].version;

                    if (version.id === engineFunction.widget.source.id && version.version === engineFunction.widget.source.version) {
                        defaultConfigurationForEngineFunction[0].widget.source = version;
                        defaultConfigurationForEngineFunction[0].widget.configuration = engineFunction.widget.configuration;
                    }
                }
            }
        }

        if (defaultConfigurationForEngineFunction.length > 0 && engineFunction.presentation!=null) {
            for (let pIndex = 0; pIndex < presentations.length; pIndex++) {
                var presentation = presentations[pIndex];

                for (let vIndex = 0; vIndex < presentation.versions.length; vIndex++) {
                    const version = presentation.versions[vIndex].version;

                    if(engineFunction.presentation.source){
                        if (version.id === engineFunction.presentation.source.id && version.version === engineFunction.presentation.source.version) {
                            defaultConfigurationForEngineFunction[0].presentation.source = version;
                            defaultConfigurationForEngineFunction[0].presentation.configuration = engineFunction.presentation.configuration;
                        }
                    }

                }
            }
        }        

        userInterfaceConfig.tools = userInterfaceConfig.tools.concat(defaultConfigurationForEngineFunction);
    }
}

module.exports = {
    updateEngineConfiguratoin: async (req, res) => {
        if (!req.body || (!req.body.id && !req.user.id) || !req.body.engineFunctions) {
            return res.sendStatus(401).end()
        }


        try {
            let id = req.user.id;

            if (req.body.id) {
                id = req.body.id;
            }

            let profileClass = require("../../../core/profile/profile");
            let profile = new profileClass();

            const loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);
            const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", id);
            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            if (loadProfileRequestResult.result.length > 0) {
                profile.id = loadProfileRequestResult.result[0].id;
                profile.type = loadProfileRequestResult.result[0].type;
                profile.locale = loadProfileRequestResult.result[0].locale;

                await profileBuilder.loadActiveUserInterfaces(profile);

                // reset userInterfaces tools

                for (let i = 0; i < profile.userInterfaces.length; i++) {
                    profile.userInterfaces[i].tools = [];
                }

                //Hack!
                if (profile.userInterfaces.length > 1) {
                    console.log("This should never happen...")
                    profile.userInterfaces.length = 1;
                }


                const engineFunctionConfigObjs = JSON.parse(req.body.engineFunctions);
                const enabledEngineFunctionConfigObjs = engineFunctionConfigObjs.filter(config => config.enable);


                profile.debugMode = core.debugMode;
                profile.userLoaded = true;

                loadFunctions(profile.userInterfaces[0], enabledEngineFunctionConfigObjs);
                // loadProfileWithNewEngineConfig(enabledEngineFunctionConfigObjs, profile);

                await profileBuilder.saveUserInterfaceConfiguration(profile, true);

                let network = require("../../../core/network/network");
                network.updateProfileForConnectedClients(profile);
            }
        } catch (error) {
            console.log(error);
            return res.sendStatus(500).end();
        }

        return res.sendStatus(200).end()
    }
}