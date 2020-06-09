const loadDefaultEngineFunctions = (panel, panelConfig, core) => {

    const engines = core.engines;
    for (const engine of engines) {
        for (const version of engine.versions) {
            for (const engineFunction of version.engine.getFunctions()) {

                if (engineFunction.includeInDefaultProfile !== true)
                    break;

                const defaultConfigurationForEngineFunctions = core.createDefaultConfigurationForEngine(version.engine.id, version.engine.version, panel);
                const defaultConfigurationForEngineFunction = defaultConfigurationForEngineFunctions.filter(function (func) {
                    return (func.function.source.id === this.engineFunction.id)
                }, {engineFunction});

                panelConfig.tools = panelConfig.tools.concat(defaultConfigurationForEngineFunction);
            }
        }
    }

    return panelConfig;
}

let profileBuilder = {

    loadDefaultProfile(profile) {


        let core = rootRequire("core/core");

        /*
        let overlay = core.getUserInterface("overlay", "1.0");
        let overlayConfig = overlay.getDefaultConfiguration();
        overlayConfig = loadDefaultEngineFunctions(overlay, overlayConfig, core);

        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("ibm-content-clarifier", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("colorize", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("dictionary", "1.0", overlay));
        
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("dictionary", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("personalization", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("image_search", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("aws-polly-tts", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("texthelp", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("screen-ruler", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("font-tools", "1.0", overlay));
        //overlayConfig.tools = overlayConfig.tools.concat(core.createDefaultConfigurationForEngine("text-analysis", "1.0", overlay));
        
        profile.userInterfaces.push(overlayConfig);

        */

        let tabSlideOut = core.getUserInterface("tab-slide-out", "1.0");
        let tabSlideOutConfig = tabSlideOut.getDefaultConfiguration();
        tabSlideOutConfig = loadDefaultEngineFunctions(tabSlideOut, tabSlideOutConfig, core);
        //tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("colorize", "1.0", tabSlideOut));
        //    tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("dictionary", "1.0", tabSlideOut));
        //    tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("personalization", "1.0", tabSlideOut));
        //    tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("image_search", "1.0", tabSlideOut));
        //tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("aws-polly-tts", "1.0", tabSlideOut));
        //tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(core.createDefaultConfigurationForEngine("font-tools", "1.0", tabSlideOut));

        profile.userInterfaces.push(tabSlideOutConfig);

        let plugin = core.getPlugin("test-plugin", "1.0");
        profile.plugins = [plugin.getDefaultConfiguration()];

        profile.busyAnimation = core.getDefaultBusyAnimation();

        profile.userInterfaceCollectionID = 0;

        profile.static = core.static;
        profile.staticCSS = core.staticCSS;
        profile.debugMode = core.debugMode;
        profile.userLoaded = true;
    },

    createClassMappings: function (profile) {

        //Creates a class mapping json object so that clients can initialize objects of user-interface-classes
        //Injected as string in regular mode
        //Injected as url to js file in private dir of user
        let classMappings = [];
        let functionMappings = [];
        for (let i = 0; i < profile.userInterfaces.length; i++) {
            for (let j = 0; j < profile.userInterfaces[i].tools.length; j++) {

                if (profile.userInterfaces[i].tools[j].widget) {
                    if (classMappings.indexOf(profile.userInterfaces[i].tools[j].widget.source.implementationClass) === -1) {
                        classMappings.push(profile.userInterfaces[i].tools[j].widget.source.implementationClass);
                    }
                }
                if (profile.userInterfaces[i].tools[j].presentation) {
                    if (classMappings.indexOf(profile.userInterfaces[i].tools[j].presentation.source.implementationClass) === -1) {
                        classMappings.push(profile.userInterfaces[i].tools[j].presentation.source.implementationClass);
                    }

                }

                if (profile.userInterfaces[i].tools[j].function.source.type === "LocalFunction") {
                    functionMappings.push(profile.userInterfaces[i].tools[j].function.source.entryPoint);
                }

            }

            classMappings.push(profile.userInterfaces[i].source.implementationClass);
        }

        classMappings.push(profile.busyAnimation.source.implementationClass);


        let classMapping = "if(classMapping){delete classMapping;} var classMapping = {";

        for (let i = 0; i < classMappings.length; i++) {
            classMapping += "'" + classMappings[i] + "':" + classMappings[i] + ",";
        }

        classMapping += "};";

        classMapping += "if(functionMapping){delete functionMapping;}  var functionMapping = {";
        for (let i = 0; i < functionMappings.length; i++) {
            classMapping += "'" + functionMappings[i] + "':" + functionMappings[i] + ",";
        }
        classMapping += "};";


        let fs = require('fs');
        let path = require('path');

        if (!fs.existsSync(path.join(__dirname, "../../", "/public/tmp/" + profile.uuid))) {
            fs.mkdirSync(path.join(__dirname, "../../", "/public/tmp/" + profile.uuid));
        }

        let core = rootRequire("core/core");
        if (!core.debugMode) {
            profile.classMapping = btoa(classMapping);
        } else {


            try {
                fs.writeFileSync(path.join(__dirname, "../../", "/public/tmp/" + profile.uuid + "/classMapping.js"), classMapping);
                profile.classMapping = "tmp/" + profile.uuid + "/classMapping.js";

            } catch (err) {
                console.log('Error in writing file');
                console.log(err);
            }

        }


    },

    async saveProfile(profile, withUIConfiguration = true) {

        let databaseManager = require("./../database/database-manager");

        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", profile.email);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        let profileData = {
            ...profile
        };

        if (loadProfileRequestResult.result.length > 0) {

            let updateProfileRequest = databaseManager.createRequest("profile").update(profileData).where("id", "=", loadProfileRequestResult.result[0].id);
            let updateProfileRequestResult = await databaseManager.executeRequest(updateProfileRequest);
            profile.id = this.id = loadProfileRequestResult.result[0].id;

        } else {
            let saveProfileRequest = databaseManager.createRequest("profile").insert(profileData);
            let saveProfileRequestResult = await databaseManager.executeRequest(saveProfileRequest);
            profile.id = saveProfileRequestResult.id;


        }
        await this.saveRoles(profile);


        if (withUIConfiguration) {

            await this.saveUserInterfaceConfiguration(profile, true);

        }

    },

    async saveRoles(profile) {
        let databaseManager = require("./../database/database-manager");
        let deleteRoleRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id).delete();
        await databaseManager.executeRequest(deleteRoleRequest);

        for (let i = 0; i < profile.roles.length; i++) {

            let saveRoleRequest = databaseManager.createRequest("role").insert({
                user_id: profile.id,
                role: profile.roles[i]
            });
            await databaseManager.executeRequest(saveRoleRequest);

        }
    },

    async saveUserInterfaceConfiguration(profile, active = false) {
        let errorMsg = null;

        try {
            let databaseManager = require("./../database/database-manager");

            if (profile.userInterfaceCollectionID === 0) {

                let userInterfaceCollectionData = {
                    pid: profile.id,
                    active: active,
                };

                let request = databaseManager.createRequest("ui_collection").insert(userInterfaceCollectionData);

                let collectionInsertResult = await databaseManager.executeRequest(request);

                profile.userInterfaceCollectionID = collectionInsertResult.id;

            } else {

                //Delete old collection.
                await profileBuilder.deleteUserInterfacesForCollection(profile.userInterfaceCollectionID);

                //Update new collection
                let userInterfaceCollectionData = {
                    pid: profile.id,
                    active: active,
                };

                let request = databaseManager.createRequest("ui_collection").update(userInterfaceCollectionData).where("id", "=", profile.userInterfaceCollectionID);
                let collectionInsertResult = await databaseManager.executeRequest(request);
            }

            for (let i = 0; i < profile.userInterfaces.length; i++) {
                let userInterfaceConfigurationData = {
                    ui_id: profile.userInterfaces[i].source.id,
                    ui_version: profile.userInterfaces[i].source.version,
                    //         ui_conf_id: null,
                    ui_collection: profile.userInterfaceCollectionID,
                };

                if (profile.userInterfaces[i].configuration) {


                    let uiComponentSaveRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(profile.userInterfaces[i].source)).insert(profile.userInterfaces[i].configuration);
                    let uiComponentSaveRequestResult = await databaseManager.executeRequest(uiComponentSaveRequest);

                    userInterfaceConfigurationData.ui_conf_id = uiComponentSaveRequestResult.id;

                }

                let uiConfRequest = databaseManager.createRequest("ui_conf").insert(userInterfaceConfigurationData);
                let uiConfigInsertResult = await databaseManager.executeRequest(uiConfRequest);

                for (let j = 0; j < profile.userInterfaces[i].tools.length; j++) {

                    let currentTool = profile.userInterfaces[i].tools[j];

                    let toolConfiguration = {
                        ui_conf_id: uiConfigInsertResult.id,
                        engine_id: currentTool.function.source.engine.id,
                        engine_version: currentTool.function.source.engine.version,
                        function_id: currentTool.function.source.id,
                        widget_id: currentTool.widget.source.id,
                        widget_version: currentTool.widget.source.version,
                        order_in_ui: j,
                    };

                    if (typeof currentTool.function.configuration !== 'undefined') {
                        let engineConfiguration = currentTool.function.configuration;
                        let engineConfigRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForEngine(currentTool.function.source.engine)).insert(engineConfiguration);
                        let engineConfigInsertResult = await databaseManager.executeRequest(engineConfigRequest);

                        toolConfiguration.engine_conf_id = engineConfigInsertResult.id;
                    }

                    if (typeof currentTool.widget.configuration !== 'undefined') {
                        let widgetConfiguration = currentTool.widget.configuration;
                        let widgetConfigRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(currentTool.widget.source)).insert(widgetConfiguration);
                        let widgetConfigInsertResult = await databaseManager.executeRequest(widgetConfigRequest);

                        toolConfiguration.widget_conf_id = widgetConfigInsertResult.id;
                    }

                    if (typeof currentTool.presentation !== 'undefined') {
                        toolConfiguration.presentation_id = currentTool.presentation.source.id;
                        toolConfiguration.presentation_version = currentTool.presentation.source.version;

                        if (typeof currentTool.presentation.configuration !== 'undefined') {
                            let presentationConfiguration = currentTool.presentation.configuration;
                            let presentationConfigRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForEngine(currentTool.presentation.source)).insert(presentationConfiguration);
                            let presentationConfigInsertResult = await databaseManager.executeRequest(presentationConfigRequest);

                            toolConfiguration.presentation_conf_id = presentationConfigInsertResult.id;
                        }
                    }

                    if (typeof currentTool.layout !== 'undefined') {
                        let layoutConfiguration = currentTool.layout;
                        let layoutConfigRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForLayout(profile.userInterfaces[i].source)).insert(layoutConfiguration);
                        let layoutConfigInsertResult = await databaseManager.executeRequest(layoutConfigRequest);

                        toolConfiguration.layout_conf_id = layoutConfigInsertResult.id;
                    }

                    let toolConfigRequest = databaseManager.createRequest('tool_conf').insert(toolConfiguration);
                    let toolConfigInsertResult = await databaseManager.executeRequest(toolConfigRequest);
                }
            }

            if (profile.busyAnimation) {

                let busyAnimationSaveRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForEngine(profile.busyAnimation.source)).insert(profile.busyAnimation.configuration);
                let busyAnimationSaveRequestResult = await databaseManager.executeRequest(busyAnimationSaveRequest);

                let busy_animation_configuration = {
                    ui_collection: profile.userInterfaceCollectionID,
                    busy_animation_id: profile.busyAnimation.source.id,
                    busy_animation_version: profile.busyAnimation.source.version,
                    busy_animation_conf_id: busyAnimationSaveRequestResult.id,
                };

                let busyAnimationConfigSaveRequest = databaseManager.createRequest('busy_animation_conf').insert(busy_animation_configuration);
                let busyAnimationConfigSaveRequestResult = await databaseManager.executeRequest(busyAnimationConfigSaveRequest);

            }

            for (let i = 0; i < profile.plugins.length; i++) {
                let plugin = profile.plugins[i].source;

                let plugin_data = {
                    ui_collection: profile.userInterfaceCollectionID,
                    plugin_id: plugin.id,
                    plugin_version: plugin.version,
                };

                let pluginSaveRequest = databaseManager.createRequest('plugin_conf').insert(plugin_data);
                let pluginSaveRequestResult = await databaseManager.executeRequest(pluginSaveRequest);

            }
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });


    },

    loadActiveUserInterfaces: async function (profile) {
        let databaseManager = require("./../database/database-manager");

        try {
            let loadActiveUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", profile.id);

            let loadActiveUserInterfaceRequestResult = await databaseManager.executeRequest(loadActiveUserInterfaceRequest);

            if (loadActiveUserInterfaceRequestResult.result.length > 0) {

                profile.userInterfaceCollectionID = loadActiveUserInterfaceRequestResult.result[0].id;
                return this.loadUserInterfaces(profile, profile.userInterfaceCollectionID);

            } else {
                return new Promise(function (resolve, reject) {
                    profileBuilder.loadDefaultProfile(profile);
                    resolve(profile);
                });


            }
        } catch (error) {
            return new Promise(function (resolve, reject) {
                reject(error);
            });

        }


    },

    loadUserInterfaces: async function (profile, collectionID) {

        let errorMsg = null;
        try {
            profile.userInterfaceCollectionID = collectionID;

            let core = require("./../core");
            let databaseManager = require("./../database/database-manager");

            let loadUserInterfacesRequest = databaseManager.createRequest("ui_conf").where("ui_collection", "=", collectionID);

            let loadUserInterfacesRequestResult = await databaseManager.executeRequest(loadUserInterfacesRequest);

            let userInterfaces = [];

            for (let i = 0; i < loadUserInterfacesRequestResult.result.length; i++) {

                //User Interface
                let uiInfo = loadUserInterfacesRequestResult.result[i];
                let userInterface = core.getUserInterface(uiInfo.ui_id, uiInfo.ui_version);

                let uiConfiguration = {};
                if (userInterface.hasConfigurationSchema()) {
                    let tableName = databaseManager.getConfigTableNameForComponent(userInterface);

                    let userInterfaceConfigurationRequest = databaseManager.createRequest(tableName).where("id", "=", uiInfo.ui_conf_id);
                    let userInterfaceConfigurationRequestResult = await databaseManager.executeRequest(userInterfaceConfigurationRequest);

                    let configuration = await databaseManager.getObjectFromResult(userInterfaceConfigurationRequestResult.result[0], tableName);
                    uiConfiguration = userInterface.getConfiguration(configuration);
                } else {
                    uiConfiguration = userInterface.getConfiguration(null);
                }


                //Tools
                let toolConfigurationRequest = databaseManager.createRequest("tool_conf").where("ui_conf_id", "=", uiInfo.id).orderBy("order_in_ui", "ASC");
                let toolConfigurationRequestResult = await databaseManager.executeRequest(toolConfigurationRequest);

                uiConfiguration.tools = [];

                for (let j = 0; j < toolConfigurationRequestResult.result.length; j++) {
                    let toolConfiguration = toolConfigurationRequestResult.result[j];

                    let currentConfiguration = {};

                    //Function
                    let engine = core.getEngine(toolConfiguration.engine_id, toolConfiguration.engine_version);
                    if (!engine) {
                        //TODO This should only happen when engine functions have been removed, but they are still stored in the profile
                        continue;
                    }
                    let engineFunction = engine.getFunction(toolConfiguration.function_id);
                    if (!engineFunction) {
                        //TODO This should only happen when engine functions have been removed, but they are still stored in the profile
                        continue;
                    }
                    if (toolConfiguration.engine_conf_id) {
                        let functionConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForEngine(engine)).where("id", "=", toolConfiguration.engine_conf_id);
                        let functionConfigurationRequestResult = await databaseManager.executeRequest(functionConfigurationRequest);

                        let functionConfiguration = await databaseManager.getObjectFromResult(functionConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForEngine(engine));

                        currentConfiguration.function = {
                            source: engineFunction.getFunctionInformation(profile.locale),
                            configuration: functionConfiguration,
                        }

                    } else {

                        currentConfiguration.function = {
                            source: engineFunction.getFunctionInformation(profile.locale),
                            configuration: engine.getDefaultData(),
                        }
                    }

                    //Widget
                    let widget = core.getWidget(toolConfiguration.widget_id, toolConfiguration.widget_version);
                    if (toolConfiguration.widget_conf_id) {
                        let widgetConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(widget)).where("id", "=", toolConfiguration.widget_conf_id);
                        let widgetConfigurationRequestResult = await databaseManager.executeRequest(widgetConfigurationRequest);

                        let widgetConfiguration = await databaseManager.getObjectFromResult(widgetConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForComponent(widget));
                        currentConfiguration.widget = widget.getConfiguration(widgetConfiguration);

                    } else {
                        currentConfiguration.widget = widget.getDefaultConfiguration();
                    }

                    //Presentation

                    if (toolConfiguration.presentation_id) {

                        let presentation = core.getPresentation(toolConfiguration.presentation_id, toolConfiguration.presentation_version);
                        if (toolConfiguration.presentation_conf_id) {
                            let presentationConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(presentation)).where("id", "=", toolConfiguration.presentation_conf_id);
                            let presentationConfigurationRequestResult = await databaseManager.executeRequest(presentationConfigurationRequest);

                            let presentationConfiguration = await databaseManager.getObjectFromResult(presentationConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForComponent(presentation));

                            currentConfiguration.presentation = presentation.getConfiguration(presentationConfiguration);
                        } else {
                            currentConfiguration.presentation = presentation.getDefaultConfiguration();
                        }


                    } else {

                        //Do nothing if no presentation present
                    }

                    if (toolConfiguration.layout_conf_id) {

                        let layoutConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForLayout(userInterface)).where("id", "=", toolConfiguration.layout_conf_id);
                        let layoutConfigurationRequestResult = await databaseManager.executeRequest(layoutConfigurationRequest);

                        currentConfiguration.layout = await databaseManager.getObjectFromResult(layoutConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForLayout(userInterface));

                    } else {
                        currentConfiguration.layout = userInterface.getDefaultToolLayoutConfiguration();
                    }
                    uiConfiguration.tools.push(currentConfiguration);
                }
                userInterfaces.push(uiConfiguration);
            }
            profile.userInterfaces = userInterfaces;

            //
            let loadUserBusyAnimationRequest = databaseManager.createRequest("busy_animation_conf").where("ui_collection", "=", collectionID);
            let loadUserBusyAnimationRequestResult = await databaseManager.executeRequest(loadUserBusyAnimationRequest);
            if (loadUserBusyAnimationRequestResult.result.length !== 0) {
                let busyAnimation = core.getBusyAnimation(loadUserBusyAnimationRequestResult.result[0].busy_animation_id, loadUserBusyAnimationRequestResult.result[0].busy_animation_version);

                if (loadUserBusyAnimationRequestResult.result[0].busy_animation_conf_id) {
                    let busyAnimationConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(busyAnimation)).where("id", "=", loadUserBusyAnimationRequestResult.result[0].busy_animation_conf_id);
                    let busyAnimationConfigurationRequestResult = await databaseManager.executeRequest(busyAnimationConfigurationRequest);

                    let busyAnimationConfiguration = await databaseManager.getObjectFromResult(busyAnimationConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForComponent(busyAnimation));

                    profile.busyAnimation = busyAnimation.getConfiguration(busyAnimationConfiguration);
                } else {
                    profile.busyAnimation = busyAnimation.getDefaultConfiguration();
                }

            } else {
                profile.busyAnimation = core.getDefaultBusyAnimation();
            }


            // Plug-ins
            let loadUserPluginsRequest = databaseManager.createRequest("plugin_conf").where("ui_collection", "=", collectionID);
            let loadUserPluginsRequestResult = await databaseManager.executeRequest(loadUserPluginsRequest);
            let plugins = [];
            for (let i = 0; i < loadUserPluginsRequestResult.result.length; i++) {
                let plugin_info = loadUserPluginsRequestResult.result[i];
                let plugin = core.getPlugin(plugin_info.plugin_id, plugin_info.plugin_version);
                if (plugin) {
                    plugins.push(plugin.getConfiguration(null));
                }
            }
            profile.plugins = plugins;

        } catch (error) {
            errorMsg = error;
        }
        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });
    },

    async deleteProfile(profile) {

        let errorMsg = null;
        try {
            let databaseManager = require("./../database/database-manager");
            let loadUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", profile.id);
            let loadUserInterfaceRequestResult = await databaseManager.executeRequest(loadUserInterfaceRequest);

            if (loadUserInterfaceRequestResult.result.length > 0) {
                for (let i = 0; i < loadUserInterfaceRequestResult.result.length; i++) {
                    await this.deleteUserInterfacesForCollection(loadUserInterfaceRequestResult.result[i].id);
                }
            }
            let deleteUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", profile.id).delete();
            let deleteUserInterfaceRequestResult = await databaseManager.executeRequest(deleteUserInterfaceRequest);

            let deleteRolesRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id).delete();
            let deleteRolesRequestResult = await databaseManager.executeRequest(deleteRolesRequest);

            let deleteClientCarerRelationRequest = databaseManager.createRequest("client_carer_relation").where("client_id", "=", profile.id).delete();
            let deleteClientCarerRelationRequestResult = await databaseManager.executeRequest(deleteClientCarerRelationRequest);

            deleteClientCarerRelationRequest = databaseManager.createRequest("client_carer_relation").where("carer_id", "=", profile.id).delete();
            deleteClientCarerRelationRequestResult = await databaseManager.executeRequest(deleteClientCarerRelationRequest);



            await profileBuilder.deleteProfileSupportCategories(profile);

            profileBuilder.deleteProfileReasoners(profile);

            let deleteProfileRequest = databaseManager.createRequest("profile").where("id", "=", profile.id).delete();
            let deleteProfileRequestResult = await databaseManager.executeRequest(deleteProfileRequest);


        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });
    },

    deleteAnonymousAccounts: async function () {

        let databaseManager = require("./../database/database-manager");
        let anonymousAccountsRequest = databaseManager.createRequest("role").where("role", "=", "anonym");
        let anonymousAccountsRequestResult = await databaseManager.executeRequest(anonymousAccountsRequest);

        for (let i = 0; i < anonymousAccountsRequestResult.result.length; i++) {

            let profileBuilder = require("../profile/profile-builder");
            await profileBuilder.deleteProfile({
                id: anonymousAccountsRequestResult.result[i].user_id,
            });
        }

    },

    deleteUserInterfacesForCollection: async function (collectionID) {
        let errorMsg = null;
        try {
            let core = require("./../core");
            let databaseManager = require("./../database/database-manager");
            let loadUserInterfacesRequest = databaseManager.createRequest("ui_conf").where("ui_collection", "=", collectionID);
            let loadUserInterfacesRequestResult = await databaseManager.executeRequest(loadUserInterfacesRequest);

            for (let i = 0; i < loadUserInterfacesRequestResult.result.length; i++) {

                //User Interface
                let uiInfo = loadUserInterfacesRequestResult.result[i];
                let userInterface = core.getUserInterface(uiInfo.ui_id, uiInfo.ui_version);

                //Tools
                let toolConfigurationRequest = databaseManager.createRequest("tool_conf").where("ui_conf_id", "=", uiInfo.id).orderBy("order_in_ui", "ASC");
                let toolConfigurationRequestResult = await databaseManager.executeRequest(toolConfigurationRequest);

                for (let j = 0; j < toolConfigurationRequestResult.result.length; j++) {

                    let toolConfiguration = toolConfigurationRequestResult.result[j];

                    if (toolConfiguration.engine_conf_id) {

                        let engine = core.getEngine(toolConfiguration.engine_id, toolConfiguration.engine_version);
                        let engineFunction = engine.getFunction(toolConfiguration.function_id);
                        let functionConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForEngine(engine)).where("id", "=", toolConfiguration.engine_conf_id).delete();

                        await databaseManager.executeRequest(functionConfigurationRequest);
                    }

                    if (toolConfiguration.widget_conf_id) {

                        let widget = core.getWidget(toolConfiguration.widget_id, toolConfiguration.widget_version);
                        let widgetConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(widget)).where("id", "=", toolConfiguration.widget_conf_id).delete();

                        await databaseManager.executeRequest(widgetConfigurationRequest);
                    }

                    if (toolConfiguration.presentation_conf_id) {

                        let presentation = core.getPresentation(toolConfiguration.presentation_id, toolConfiguration.presentation_version);
                        let widgetConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(presentation)).where("id", "=", toolConfiguration.presentation_conf_id).delete();

                        await databaseManager.executeRequest(widgetConfigurationRequest);
                    }

                    if (toolConfiguration.layout_conf_id) {

                        let layoutConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForLayout(userInterface)).where("id", "=", toolConfiguration.layout_conf_id).delete();

                        await databaseManager.executeRequest(layoutConfigurationRequest);

                    }
                }

                //Delete tool configurations
                let toolConfigurationDeleteRequest = databaseManager.createRequest("tool_conf").where("ui_conf_id", "=", uiInfo.id).delete();
                await databaseManager.executeRequest(toolConfigurationDeleteRequest);

                //Delete ui-config
                if (uiInfo.ui_conf_id) {
                    let userInterfaceConfigurationDeleteRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(userInterface)).where("id", "=", uiInfo.ui_conf_id).delete();
                    let userInterfaceConfigurationDeleteRequestResult = await databaseManager.executeRequest(userInterfaceConfigurationDeleteRequest);
                }

                //Delete busy-animation conf
                let loadUserBusyAnimationRequest = databaseManager.createRequest("busy_animation_conf").where("ui_collection", "=", collectionID);
                let loadUserBusyAnimationRequestResult = await databaseManager.executeRequest(loadUserBusyAnimationRequest);
                if (loadUserBusyAnimationRequestResult.result.length !== 0) {


                    let busyAnimation = core.getBusyAnimation(loadUserBusyAnimationRequestResult.result[0].busy_animation_id, loadUserBusyAnimationRequestResult.result[0].busy_animation_version);

                    if (loadUserBusyAnimationRequestResult.result[0].busy_animation_conf_id) {
                        let deleteBusyAnimationConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(busyAnimation)).where("id", "=", loadUserBusyAnimationRequestResult.result[0].busy_animation_conf_id).delete();
                        let deleteBusyAnimationConfigurationRequestResult = await databaseManager.executeRequest(deleteBusyAnimationConfigurationRequest);
                    }

                }
                // Delete busy-animation
                let deleteBusyAnimationConfRequest = databaseManager.createRequest("busy_animation_conf").where("ui_collection", "=", collectionID).delete();
                let deleteBusyAnimationConfRequestResult = await databaseManager.executeRequest(deleteBusyAnimationConfRequest);


                // Delete plug-ins
                let deleteUserPluginRequest = databaseManager.createRequest("plugin_conf").where("ui_collection", "=", collectionID).delete();
                let deleteUserPluginRequestResult = await databaseManager.executeRequest(deleteUserPluginRequest);

            }

            //Delete ui configurations
            let deleteUiConfigRequest = databaseManager.createRequest("ui_conf").where("ui_collection", "=", collectionID).delete();
            await databaseManager.executeRequest(deleteUiConfigRequest);

        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });

    },

    normalizeCSSPaths: function (profile, serverUrl) {
        for (let i = 0; i < profile.userInterfaces.length; i++) {
            normalizePath(profile.userInterfaces[i], serverUrl);
            for (let j = 0; j < profile.userInterfaces[i].tools.length; j++) {
                if (profile.userInterfaces[i].tools[j].function.source.type === "LocalFunction") {
                    normalizePath(profile.userInterfaces[i].tools[j].function, serverUrl);
                }
                normalizePath(profile.userInterfaces[i].tools[j].widget, serverUrl);
                if (typeof profile.userInterfaces[i].tools[j].presentation !== 'undefined') {
                    normalizePath(profile.userInterfaces[i].tools[j].presentation, serverUrl);
                }
            }

        }
    },

    normalizeIconPaths: function (profile, serverUrl) {
        for (let i = 0; i < profile.userInterfaces.length; i++) {
            for (let j = 0; j < profile.userInterfaces[i].tools.length; j++) {
                profile.userInterfaces[i].tools[j].function.source.defaultIconURL = serverUrl + profile.userInterfaces[i].tools[j].function.source.defaultIconURL;
            }

        }

    },

    normalizeRemoteAssetDirectoryPaths: function (profile, serverUrl) {
        for (let i = 0; i < profile.userInterfaces.length; i++) {

            if (profile.userInterfaces[i].source.remoteAssetDirectory !== "") {
                if (profile.userInterfaces[i].configuration) {
                    profile.userInterfaces[i].configuration.remoteAssetDirectory = serverUrl + profile.userInterfaces[i].source.remoteAssetDirectory;
                } else {
                    profile.userInterfaces[i].configuration = {
                        "remoteAssetDirectory": serverUrl + profile.userInterfaces[i].source.remoteAssetDirectory
                    };
                }
            }

            for (let j = 0; j < profile.userInterfaces[i].tools.length; j++) {


                let currentTool = profile.userInterfaces[i].tools[j];
                if (currentTool.widget.source.remoteAssetDirectory !== "") {
                    if (currentTool.widget.configuration) {
                        currentTool.widget.configuration.remoteAssetDirectory = serverUrl + currentTool.widget.source.remoteAssetDirectory;
                    } else {
                        currentTool.widget.configuration = {
                            "remoteAssetDirectory": serverUrl + currentTool.widget.source.remoteAssetDirectory,
                        }
                    }


                }

                if (currentTool.presentation) {
                    if (currentTool.presentation.source.remoteAssetDirectory !== "") {
                        if (currentTool.presentation.configuration) {
                            currentTool.presentation.configuration.remoteAssetDirectory = serverUrl + currentTool.presentation.source.remoteAssetDirectory;
                        } else {
                            currentTool.presentation.configuration = {
                                "remoteAssetDirectory": serverUrl + currentTool.presentation.source.remoteAssetDirectory,
                            };
                        }


                    }
                }
            }

        }
    },

    createDefaultSupportCategories(pid) {


        let profileSupportCategories = {};

        let sc = require("./profile-support-categories");
        let supportCategories = sc.supportCategories;

        Object.keys(supportCategories).forEach(function (categoryName, index) {

            let category = supportCategories[categoryName];

            profileSupportCategories[categoryName] = {};

            Object.keys(category).forEach(function (subcategoryName, index) {

                let subCategoryTitle = sc.getNameForSubCategory(categoryName, subcategoryName);
                let databaseDefinitions = require("../database/core-table-definitions");

                databaseDefinitions.getDefinitions();

                let profileUnderstandingSupportSchema = databaseDefinitions.getDefinitionByTitle(subCategoryTitle);
                let defaults = require('json-schema-defaults');


                profileSupportCategories[categoryName][subcategoryName] = defaults(profileUnderstandingSupportSchema);
                profileSupportCategories[categoryName][subcategoryName].pid = pid;


            });


        });

       return profileSupportCategories;

    },

    async saveSupportCategoriesForProfileWithID(pid,supportCategories){
      await profileBuilder.saveProfileSupportCategories({
          pid:pid,
          supportCategories: supportCategories,
      })
    },

    async saveProfileSupportCategories(profile) {

        let sc = require("./profile-support-categories");
        let supportCategories = sc.supportCategories;

        for (let categoryName in supportCategories) {
            for (let subcategoryName in supportCategories[categoryName]) {

                let subCategoryTitle = sc.getNameForSubCategory(categoryName, subcategoryName);

                let databaseManager = require("./../database/database-manager");

                let objectToSave = profile.supportCategories[categoryName][subcategoryName];

                let request = databaseManager.createRequest(subCategoryTitle).insertOrUpdate(objectToSave);
                let collectionInsertResult = await databaseManager.executeRequest(request);

            }
        }

    },

    async loadProfileSupportCategories(profile) {

        let sc = require("./profile-support-categories");
        let databaseManager = require("./../database/database-manager");

        let profileSupportCategories = profileBuilder.createDefaultSupportCategories(profile.id);

        profile.supportCategories = profileSupportCategories;

        let supportCategories = sc.supportCategories;

        for (let categoryName in supportCategories) {
            for (let subcategoryName in supportCategories[categoryName]) {

                let subCategoryTitle = sc.getNameForSubCategory(categoryName, subcategoryName);

                let loadSubCategoryRequest = databaseManager.createRequest(subCategoryTitle).where("pid", "=", profile.id);

                let loadSubCategoryRequestResult = await databaseManager.executeRequest(loadSubCategoryRequest);
                if (loadSubCategoryRequestResult.result.length > 0) {

                    if(loadSubCategoryRequestResult.result[0].preference === null){
                        loadSubCategoryRequestResult.result[0].preference = 0;
                    }

                    profile.supportCategories[categoryName][subcategoryName] = loadSubCategoryRequestResult.result[0];

                }

            }
        }

    },
    async deleteProfileSupportCategories(profile) {

        let sc = require("./profile-support-categories");
        let databaseManager = require("./../database/database-manager");

        let profileSupportCategories = profileBuilder.createDefaultSupportCategories(profile.id);

        profile.supportCategories = profileSupportCategories;

        let supportCategories = sc.supportCategories;

        for (let categoryName in supportCategories) {
            for (let subcategoryName in supportCategories[categoryName]) {

                let subCategoryTitle = sc.getNameForSubCategory(categoryName, subcategoryName);

                let deleteSubCategoryRequest = databaseManager.createRequest(subCategoryTitle).where("pid", "=", profile.id).delete();
                await databaseManager.executeRequest(deleteSubCategoryRequest);

            }
        }

    },

    async deleteProfileReasoners(profile) {
        let databaseManager = require("./../database/database-manager");
        let rUtil = rootRequire("core/user_tracking/reasoner-utils");
        let reasoners = await rUtil.loadProfileReasoner(profile, 'all', false, false);
        for (let i=0; i<reasoners.length; i++) {
            let rid = reasoners[i].id;
            if (rid) {
                let deleteReasonerParamsRequest = databaseManager.createRequest("profile_reasoner_params").where("rid", "=", rid).delete();
                databaseManager.executeRequest(deleteReasonerParamsRequest);
            }
        }
        let deleteUserReasonersRequest = databaseManager.createRequest("profile_reasoner").where("pid", "=", profile.id).delete();
        databaseManager.executeRequest(deleteUserReasonersRequest);
    },

};


module.exports = profileBuilder;

function normalizePath(objectToNormalize, serverUrl) {

    for (let i = 0; i < objectToNormalize.source.contentCSS.length; i++) {

        let decodedCSS = atob(objectToNormalize.source.contentCSS[i].css);
        let pathParts = objectToNormalize.source.contentCSS[i].id.split('/');
        let path = "";
        if (pathParts.length > 1) {
            for (let k = 0; k < pathParts.length - 1; k++) {
                path += pathParts[k] + "/";
            }
        }


        let parseCssUrls = require('css-url-parser');
        let cssUrls = parseCssUrls(decodedCSS);

        let helperFunctions = rootRequire("core/util/helper-functions");
        for (let j = 0; j < cssUrls.length; j++) {

            if (!helperFunctions.isExternalUrl(cssUrls[j])) {
                decodedCSS = decodedCSS.replace(new RegExp(cssUrls[j], 'g'), serverUrl + objectToNormalize.source.remoteBaseDirectory + path + cssUrls[j]);
            }
        }

        objectToNormalize.source.contentCSS[i].css = btoa(decodedCSS);

        /*
                let css = require('css');
                let obj = css.parse(decodedCSS);
                for (let j = 0; j < obj.stylesheet.rules.length; j++) {
                    if (obj.stylesheet.rules[j].type === 'rule') {
                        for (let k = 0; k < obj.stylesheet.rules[j].declarations.length; k++) {
                            if (obj.stylesheet.rules[j].declarations[k].value) {
                                if (obj.stylesheet.rules[j].declarations[k].value.startsWith("url")) {

                                    let matches = obj.stylesheet.rules[j].declarations[k].value.match(/"(.*?)"/);

                                    if (matches) {
                                        let submatch = matches[1];

                                        let newURL = serverUrl+objectToNormalize.source.remoteBaseDirectory+path+submatch;
                                        obj.stylesheet.rules[j].declarations[k].value = newURL;
                                    }

                                }
                            }
                        }
                    }
                }
                objectToNormalize.source.contentCSS[i].css = btoa(css.stringify(obj));
                console.log(css.stringify(obj));
                */

    }

}
