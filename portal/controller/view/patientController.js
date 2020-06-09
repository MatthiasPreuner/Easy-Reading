const profileRepo = require("../../repository/profileRepo");
const engineRepo = require("../../repository/engineRepo");
const core = rootRequire("core/core");
let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
const widgets = [...rootRequire("core/core").widgets];
const presentations = [...rootRequire("core/core").presentations];
const databaseManager = core.databaseManager;

// Returns the tool:user configuration if any exists in the database.
const getToolConfigFor = async (engineFunction, toolTable, id) => {

    //const toolConfigIdForUser = await getToolConfigIdForUser(googleId);
    const toolConfigIdForUser = await engineRepo.getEngineConfigByUserId(id);

    const engineConfig = [];
    for (const tool_conf of toolConfigIdForUser.result) {
        if (tool_conf.engine_id === engineFunction.engineId
            && tool_conf.engine_version === engineFunction.engineVersion
            && tool_conf.function_id === engineFunction.id) {

            let getEngineConfigForUser = databaseManager.createRequest(toolTable).where('id', '=', tool_conf.engine_conf_id).select();

            let eEngineConfigForUser = await databaseManager.executeRequest(getEngineConfigForUser, true);
            engineConfig.push(eEngineConfigForUser);
        }
    }

    return engineConfig;
};

const getTranslationForProperties = (req, engine, engineFunctionType, dataSchemaProerty) => {
    let propertyTranslation = {};
    if (dataSchemaProerty.length > 0) {
        dataSchemaProerty.forEach(property => {
            const translatedLabel = req.__(`${engine.id}.${engine.version}.${engineFunctionType.id}.data-option.property.${property}.label`);
            propertyTranslation[property] = translatedLabel;
        });
    }
    return propertyTranslation;
};

const getTranslationForDataOptions = (req, engine, engineFunctionType, configurationDataOptions) => {

    let propertyTranslation = {};
    configurationDataOptions.forEach(configurationDataOption => {
        if (configurationDataOption.type.toLowerCase() === "colorcombination") {
            const translatedLabel = req.__(`${engine.id}.${engine.version}.${engineFunctionType.id}.data-option.${configurationDataOption.type}.label`);
            propertyTranslation[configurationDataOption.type] = translatedLabel;
        } else {
            let propertyTranslationOptionList = {};
            if (configurationDataOption.configurableDataOption != null) {

                configurationDataOption.configurableDataOption.forEach(option => {
                    const translatedLabel = req.__(`${engine.id}.${engine.version}.${engineFunctionType.id}.data-option.${configurationDataOption.type}.optionList.${option.label}`);
                    propertyTranslationOptionList[option.label] = translatedLabel;
                });
            }

            const result = getTranslationForProperties(req, engine, engineFunctionType, configurationDataOption.dataSchemaProerty);
            propertyTranslation = Object.assign({}, propertyTranslation, result);

            propertyTranslation[configurationDataOption.dataSchemaProerty[0] + "Options"] = propertyTranslationOptionList;
        }
    });

    return propertyTranslation;
};

module.exports = {
    getEngineConfigByuserId: async (req, res, next) => {
        let localeService = require("../../../core/i18n/locale-service");
        const id = parseInt(req.query.id);

        if (!id) {
            return res.redirect('/profiles');
        }

        const engines = [...rootRequire("core/core").engines];

        const toolConfigIdForUser = await engineRepo.getEngineConfigByUserId(id);
        const profile = await profileRepo.getProfileId(id);


        try{
            //If caretaker tries to configure his onw profile by just entering it as the url...
            if(!profile.roles.includes("client")){
                return res.redirect('/caretaker/clients');
            }

        }catch (e) {

            console.log(e);
        }

        const results = [];

        let toolCategories = require("../../../core/components/engines/base/engine-function").ToolCategories;
        let categorizedEngines = {...toolCategories};

        for (let category in categorizedEngines) {
            if (categorizedEngines.hasOwnProperty(category)) {
                categorizedEngines[category] = [];
            }
        }


        let profileBuilder = require("./../../../core/profile/profile-builder");
        await profileBuilder.loadProfileSupportCategories(profile);

        let i = 0;
        for (const engineType of engines) {
            for (const version of engineType.versions) {
                for (const engineFunctionType of version.engine.getFunctions()) {

                    if (!engineFunctionType.visibleInConfiguration) {
                        continue;
                    }


                    if (engineFunctionType.supportedLanguages.length > 0) {
                        if (typeof profile.locale !== "undefined") {
                            if (!engineFunctionType.supportedLanguages.includes(profile.locale)) {
                                continue;
                            }
                        }
                    }


                    let configurationDataOptions = [];
                    let configurationDataOptionTranslations = {};

                    if (typeof version.engine.getConfigurationDataOptions === 'function') {
                        configurationDataOptions = version.engine.getConfigurationDataOptions();
                        configurationDataOptionTranslations = getTranslationForDataOptions(req, version.engine, engineFunctionType, configurationDataOptions);
                    }

                    if (Object.keys(configurationDataOptionTranslations).length === 0) {
                        if (version.engine.getDataSchema().properties) {
                            configurationDataOptionTranslations = getTranslationForProperties(req, version.engine, engineFunctionType, Object.keys(version.engine.getDataSchema().properties));
                        }
                    }

                    var activeWidgetList = [];
                    var activePresentationList = [];

                    for (let wIndex = 0; wIndex < widgets.length; wIndex++) {
                        var widget = widgets[wIndex];

                        for (let vIndex = 0; vIndex < widget.versions.length; vIndex++) {
                            const version = widget.versions[vIndex].version;

                            for (let iIndex = 0; iIndex < version.inputTypes.length; iIndex++) {
                                const inputType = version.inputTypes[iIndex];

                                if (engineFunctionType.inputTypes[0].inputType == inputType.inputType) {


                                    var widgetBase = new WidgetBase();

                                    widgetBase.inputTypes = version.inputTypes;
                                    widgetBase.name = req.__(version.name);
                                    widgetBase.description = version.description;
                                    widgetBase.id = version.id;
                                    widgetBase.componentCategory = version.componentCategory;
                                    widgetBase.componentID = version.componentID;
                                    widgetBase.debugMode = version.debugMode;
                                    widgetBase.version = version.version;
                                    widgetBase.versionDescription = version.versionDescription;
                                    widgetBase.versionID = version.versionID;
                                    widgetBase.implementationClass = version.implementationClass;

                                    widgetBase.getDefaultConfiguration = version.getDefaultConfiguration;
                                    widgetBase.getConfigurationSchema = version.getConfigurationSchema;

                                    widgetBase.textualDescription = localeService.translateTextualDescription( version.textualDescription,req);
                                    widgetBase.iconsForSchemaProperties= version.iconsForSchemaProperties;

                                        widgetBase.selected = iIndex === 0;
                                    widgetBase.dataSchema = localeService.translateSchema(version.getConfigurationSchema(), req);

                                    activeWidgetList.push(widgetBase);
                                }
                            }
                        }
                    }

                    /*HACK */
                    //TODO create stat input type to prevent this
                    if(engineFunctionType.inputTypes[0].inputType === "VoidIOType"){
                        if(engineFunctionType.states){
                            for(let i=0; i < activeWidgetList.length; i++){

                                if(activeWidgetList[i].id !== "two-state-button"){
                                    activeWidgetList.splice(i, 1);
                                }
                            }
                        }else{
                            for(let i=0; i < activeWidgetList.length; i++){

                                if(activeWidgetList[i].id === "two-state-button"){
                                    activeWidgetList.splice(i, 1);
                                }
                            }
                        }
                    }



                    /* END HACK */

                    for (let pIndex = 0; pIndex < presentations.length; pIndex++) {
                        var presentation = presentations[pIndex];

                        for (let vIndex = 0; vIndex < presentation.versions.length; vIndex++) {
                            const version = presentation.versions[vIndex].version;

                            for (let oIndex = 0; oIndex < version.outputTypes.length; oIndex++) {
                                const outputType = version.outputTypes[oIndex];

                                if (engineFunctionType.outputTypes[0].outputType == outputType.outputType) {
                                    let presentationBase = new PresentationBase();

                                    presentationBase.outputTypes = version.outputTypes;
                                    presentationBase.name = version.name;
                                    presentationBase.description = version.description;
                                    presentationBase.id = version.id;
                                    presentationBase.componentCategory = version.componentCategory;
                                    presentationBase.componentID = version.componentID;
                                    presentationBase.debugMode = version.debugMode;
                                    presentationBase.version = version.version;
                                    presentationBase.versionDescription = version.versionDescription;
                                    presentationBase.versionID = version.versionID;
                                    presentationBase.implementationClass = version.implementationClass;

                                    presentationBase.getDefaultConfiguration = version.getDefaultConfiguration;
                                    presentationBase.getConfigurationSchema = version.getConfigurationSchema;

                                    presentationBase.textualDescription = localeService.translateTextualDescription( version.textualDescription,req);
                                    presentationBase.iconsForSchemaProperties= version.iconsForSchemaProperties;

                                    presentationBase.selected = oIndex === 0;
                                    presentationBase.dataSchema = localeService.translateSchema(version.getConfigurationSchema(), req);

                                    activePresentationList.push(presentationBase);
                                }
                            }
                        }
                    }


                    const engineFunction = {
                        id: engineFunctionType.id,
                        uniqueId: version.engine.id + "_" + engineFunctionType.id,
                        name: engineFunctionType.name,
                        title: req.__(`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.title`),
                        description: req.__(`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.description`),
                        descriptionId: `${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.description`,
                        sourceTitle: req.__(`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.source-title`),
                        sourceUrl: req.__(`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.source-url`),
                        howToUse: req.__(`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.howToUse`),
                        howToUseId:`${version.engine.id}.${version.engine.version}.${engineFunctionType.id}.howToUse`,
                        textualDescription: localeService.translateTextualDescription( version.engine.getTextualDescriptionForFunctionID(engineFunctionType.id),req),
                        iconsForSchemaProperties: version.engine.iconsForSchemaProperties,
                        defaultIcon: `/components/engines/${version.engine.id}/${version.engine.version}/${engineFunctionType.defaultIcon}`,
                        engineId: version.engine.id,
                        engineVersion: version.engine.version,
                        sortOrder: engineFunctionType.sortOrder,
                        enable: false,
                        dataSchema: localeService.translateSchema(version.engine.getDataSchema(), req),
                        configurationDataOptions: configurationDataOptions,
                        configurationDataOptionTranslations: configurationDataOptionTranslations,
                        bundle: engineFunctionType.bundle,
                        config: [],
                        inputTypes: activeWidgetList,
                        outputTypes: activePresentationList,
                        viewInputTypeSelector: activeWidgetList.length > 1,
                        viewOutputTypeSelector: activePresentationList.length > 1,
                        widget: {},
                        presentation: new Object(),
                        toolCategory: engineFunctionType.toolCategory,
                    };

                    let defaultWidget = core.getDefaultWidgetForFunction(engineFunctionType, profile.supportCategories);
                    if (defaultWidget) {
                        engineFunction.widget.source = activeWidgetList.filter(func => func.id === defaultWidget.source.id)[0];
                    }

                    let defaultPresentation = core.getDefaultDisplayForFunction(engineFunctionType, profile.supportCategories);
                    if (defaultPresentation) {

                        engineFunction.presentation.source = activePresentationList.filter(func => func.id === defaultPresentation.source.id)[0];
                    }

                    // check if this engine function is congifured for this user
                    for (const engineFunctionConfig of toolConfigIdForUser.result) {
                        if (engineFunctionConfig.engine_id === engineFunction.engineId
                            && engineFunctionConfig.engine_version === engineFunction.engineVersion
                            && engineFunctionConfig.function_id === engineFunction.id) {

                            engineFunction.enable = true;
                            engineFunction.widget.source = activeWidgetList.filter(func => func.id === engineFunctionConfig.widget_id)[0];
                            engineFunction.presentation.source = activePresentationList.filter(func => func.id === engineFunctionConfig.presentation_id)[0];

                            if (engineFunctionConfig.widget_conf_id != null) {
                                let widgetConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(engineFunction.widget.source)).where("id", "=", engineFunctionConfig.widget_conf_id);
                                let widgetConfigurationRequestResult = await databaseManager.executeRequest(widgetConfigurationRequest);

                                let widgetConfiguration = await databaseManager.getObjectFromResult(widgetConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForComponent(engineFunction.widget.source));
                                engineFunction.widget = engineFunction.widget.source.getConfiguration(widgetConfiguration, true);
                            }

                            if (engineFunctionConfig.presentation_conf_id != null) {
                                let presentationConfigurationRequest = databaseManager.createRequest(databaseManager.getConfigTableNameForComponent(engineFunction.presentation.source)).where("id", "=", engineFunctionConfig.presentation_conf_id);
                                let presentationConfigurationRequestResult = await databaseManager.executeRequest(presentationConfigurationRequest);

                                let presentationConfiguration = await databaseManager.getObjectFromResult(presentationConfigurationRequestResult.result[0], databaseManager.getConfigTableNameForComponent(engineFunction.presentation.source));
                                engineFunction.presentation = engineFunction.presentation.source.getConfiguration(presentationConfiguration, true);
                            }

                            break;
                        }
                    }

                    // get the engine configuratoin properties if exist
                    if (Object.keys(engineFunction.dataSchema).length !== 0) {
                        const configTableNameForEngine = databaseManager.getConfigTableNameForEngine(version.engine);
                        const engineConfiguratoins = await getToolConfigFor(engineFunction, configTableNameForEngine, id);
                        // check if config.result[0] is not 0
                        engineConfiguratoins.forEach(config => {
                            if (config.result.length > 0)
                                engineFunction.config.push({...config.result[0]});
                        });
                    }

                    categorizedEngines[engineFunctionType.toolCategory].push(engineFunction);
                    results.push(engineFunction);
                }
            }
        }


        let activeUserInterfaceConfigurations = await getUserInterfaceConfig(id);

        const userInterfaces = [...rootRequire("core/core").userInterfaces];

        let userInterfaceData = [];


        for (let i = 0; i < userInterfaces.length; i++) {

            let latestVersion = userInterfaces[i].versions[userInterfaces[i].versions.length - 1].version;
            let defaultConfiguration = latestVersion.getDefaultConfiguration();
            const userInterface = {
                id: latestVersion.id,
                componentID: latestVersion.componentID,
                name: latestVersion.name,
                dataSchema: localeService.translateSchema(latestVersion.getConfigurationSchema(), req),
                configuration: defaultConfiguration.configuration,
                active: false,
            };

            for (let k = 0; k < activeUserInterfaceConfigurations.length; k++) {

                if (activeUserInterfaceConfigurations[k].uiId === latestVersion.id) {
                    userInterface.configuration = activeUserInterfaceConfigurations[k].configuration;
                    userInterface.active = true;
                }
            }

            userInterfaceData.push(userInterface);
        }


        let sortedEngines = [];

        for (let category in categorizedEngines) {
            if (categorizedEngines.hasOwnProperty(category)) {
                let engineFunctionOfCategory =   categorizedEngines[category];

                for(let i=0; i < engineFunctionOfCategory.length; i++){


                    engineFunctionOfCategory[i].category = category;
                    engineFunctionOfCategory[i].categoryName = req.__(category);
                    if(i === 0){
                        engineFunctionOfCategory[i].firstCategoryElement = true;

                    }else{
                        engineFunctionOfCategory[i].firstCategoryElement = false;
                    }
                    if(i=== engineFunctionOfCategory.length-1){
                        engineFunctionOfCategory[i].lastCategoryElement = true;
                    }else{
                        engineFunctionOfCategory[i].lastCategoryElement = false;
                    }

                    sortedEngines.push(engineFunctionOfCategory[i]);

                }
            }
        }


        res.locals.context = {
            engineFunctions: sortedEngines,
            userInterfaces: userInterfaceData,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    }

};


async function getUserInterfaceConfig(profileID) {
    let activeUIConfigurations = [];
    let loadActiveUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", profileID);

    let loadActiveUserInterfaceRequestResult = await databaseManager.executeRequest(loadActiveUserInterfaceRequest);

    if (loadActiveUserInterfaceRequestResult.result.length > 0) {

        for (let k = 0; k < loadActiveUserInterfaceRequestResult.result.length; k++) {

            let loadUserInterfacesRequest = databaseManager.createRequest("ui_conf").where("ui_collection", "=", loadActiveUserInterfaceRequestResult.result[k].id);
            let loadUserInterfacesRequestResult = await databaseManager.executeRequest(loadUserInterfacesRequest);
            let userInterfaces = [];
            for (let i = 0; i < loadUserInterfacesRequestResult.result.length; i++) {

                //User Interface
                let uiInfo = loadUserInterfacesRequestResult.result[i];
                let userInterface = core.getUserInterface(uiInfo.ui_id, uiInfo.ui_version);

                let uiConfiguration = {
                    uiId: uiInfo.ui_id,
                    uiVersion: uiInfo.ui_version,
                    configuration: null,
                };
                if (userInterface.hasConfigurationSchema()) {
                    let tableName = databaseManager.getConfigTableNameForComponent(userInterface);

                    let userInterfaceConfigurationRequest = databaseManager.createRequest(tableName).where("id", "=", uiInfo.ui_conf_id);
                    let userInterfaceConfigurationRequestResult = await databaseManager.executeRequest(userInterfaceConfigurationRequest);

                    uiConfiguration.configuration = await databaseManager.getObjectFromResult(userInterfaceConfigurationRequestResult.result[0], tableName, true);
                }

                activeUIConfigurations.push(uiConfiguration);
            }

        }


    }

    return activeUIConfigurations;
}