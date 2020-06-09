let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");
let databaseManager = require("../../../core/database/database-manager");
router.use('/', async function (req, res, next) {

    let errorMessages = [];
    let rUtil = rootRequire("core/user_tracking/reasoner-utils");
    let supportedModels = rUtil.models;

    if (req.method === "POST") {

        let profileNeedsUpdate = false;
        if (req.body.user_language) {

            req.session.user.locale = req.body.user_language;

            let network = require("../../../core/network/network");
            let profile = network.getProfileWithID(req.session.user.id);
            if(profile){
                profile.locale = req.body.user_language;
            }

            profileNeedsUpdate = true;

        }

        if(req.body.ui_mode) {

            if(req.session.user.ui_mode !== req.body.ui_mode){

                let network = require("../../../core/network/network");
                let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);

                if(webSocketConnection){
                    if(req.body.ui_mode === "adaptable"){
                        webSocketConnection.stopAdaptivity();
                    }else{
                        webSocketConnection.startAdaptivity();
                    }

                }else{
                    console.log("error - could not locate websocket connection!");
                }

            }
            req.session.user.ui_mode = req.body.ui_mode;

        }

        try {
            if (req.body.reasoner_on && req.body.reasoner_model) {
                let user_reasoners = await rUtil.loadProfileReasoner(req.session.user, 'all', false, false);
                let network = require("../../../core/network/network");
                let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
                if (req.body.reasoner_on === 'enabled') {
                    if (user_reasoners.length <= 0) {
                        await rUtil.createNewUserReasoner(req.session.user, req.body.reasoner_model);
                    } else {
                        await rUtil.enableReasonerForUser(req.session.user, req.body.reasoner_model);
                    }
                    if (webSocketConnection) {
                        let reasoner_data = await rUtil.loadProfileReasoner(req.session.user, 'enabled', true, false);
                        webSocketConnection.sendMessage({
                            type: "userReasoner",
                            reasoner_data: JSON.stringify(reasoner_data[0]),
                        });
                    }
                } else {
                    if (user_reasoners.length > 0) {
                        await rUtil.disableUserReasoners(req.session.user);
                    }
                    if (webSocketConnection) {
                        webSocketConnection.sendMessage({
                            type: "disableReasoner",
                        });
                    }
                }
            }
        } catch (e) {
            console.log('Error handling reasoner: ' + e);
        }

        let updateProfileRequest = databaseManager.createRequest("profile").update(req.session.user).where("id", "=", req.session.user.id);
        let updateProfileRequestResult = await databaseManager.executeRequest(updateProfileRequest);

        if(profileNeedsUpdate){

            let network = require("../../../core/network/network");
             await network.userUpdated(req.session.user.id);

        }

        res.redirect(req.originalUrl);
        return;

    }
    let localeService = require("../../../core/i18n/locale-service");
    let supportedLanguages = localeService.getLocales();

    res.locals.supportedLanguages = [];
    res.locals.supportedLanguagesTTS = "page_basic_setting_language_label,";

    let userLocale = req.session.user.locale.split("_")[0];
    for (let i = 0; i < supportedLanguages.length; i++) {
        let translatedLabel = localeService.translate({
            phrase: 'language_label_' + supportedLanguages[i],
            locale: userLocale
        });

        res.locals.supportedLanguages.push({
            id: supportedLanguages[i],
            labelID: 'language_label_' + supportedLanguages[i],
            label: translatedLabel,
            userLanguage: (userLocale === supportedLanguages[i]),
        });

        if(i > 0 && i < supportedLanguages.length){
            res.locals.supportedLanguagesTTS+=","
        }
        res.locals.supportedLanguagesTTS+='language_label_' + supportedLanguages[i];


    }

    res.locals.reasoner_on = "disabled";
    let userModels = await rUtil.loadProfileReasoner(req.session.user, 'enabled', false, false);
    let userModel = '';
    if (userModels.length > 0) {
        userModel = userModels[0].model_type;
        res.locals.reasoner_on = "enabled";
    } else if (supportedModels.length > 0) {
        userModel = supportedModels[0];
    }

    res.locals.supportedModels = [];

    for (let i=0; i<supportedModels.length; i++) {
        let translatedLabel = localeService.translate({
            phrase: 'reasoner_model_' + supportedModels[i],
            locale: userLocale
        });
        res.locals.supportedModels.push({
            id: supportedModels[i],
            label: translatedLabel,
            userModel: (userModel === supportedModels[i]),
        });
    }

    res.locals.ui_mode = req.session.user.ui_mode;

    res.locals.errorMessages = errorMessages;


    let activeUserInterfaceConfigurations = await getUserInterfaceConfig(req.session.user.id);

    res.locals.UiTTS = "page_configure_settings_type_how_to_use";
    const userInterfaces = [...rootRequire("core/core").userInterfaces];

    let userInterfaceData = [];


    for(let i=0; i < userInterfaces.length; i++){

        let latestVersion = userInterfaces[i].versions[userInterfaces[i].versions.length-1].version;
        let defaultConfiguration = latestVersion.getDefaultConfiguration();
        const userInterface = {
            id: latestVersion.id,
            componentID:latestVersion.componentID,
            name: latestVersion.name,
            dataSchema: localeService.translateSchema(latestVersion.getConfigurationSchema(),req),
            configuration: defaultConfiguration.configuration,
            active: false,
            textualDescription:latestVersion.textualDescription,
            iconsForSchemaProperties: latestVersion.iconsForSchemaProperties
        };

        for(let k=0; k < activeUserInterfaceConfigurations.length; k++){

            if(activeUserInterfaceConfigurations[k].uiId === latestVersion.id){
                userInterface.configuration = activeUserInterfaceConfigurations[k].configuration;
                userInterface.active = true;
            }


        }

        userInterface.translatedName = localeService.translate({
            phrase: 'user_interface_label_' + userInterface.id,
            locale: userLocale
        });
        userInterface.labelId = "user_interface_label_"+userInterface.id;

        if(i < userInterfaces.length){
            res.locals.UiTTS+=","
        }
        res.locals.UiTTS+= userInterface.labelId;

        userInterfaceData.push(userInterface);
    }

    res.locals.context.userInterfaces =  userInterfaceData;

    return next();
});


async function getUserInterfaceConfig(profileID) {
    let activeUIConfigurations = [];
    let loadActiveUserInterfaceRequest = databaseManager.createRequest("ui_collection").where("pid", "=", profileID);

    let loadActiveUserInterfaceRequestResult = await databaseManager.executeRequest(loadActiveUserInterfaceRequest);

    if (loadActiveUserInterfaceRequestResult.result.length > 0) {

        for(let k=0; k < loadActiveUserInterfaceRequestResult.result.length; k++){

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

                    uiConfiguration.configuration = await databaseManager.getObjectFromResult(userInterfaceConfigurationRequestResult.result[0], tableName,true);
                }

                activeUIConfigurations.push(uiConfiguration);
            }

        }


    }

    return activeUIConfigurations;
}

module.exports = router;