class Profile {
    constructor(uuid) {

        this.id = 0;
        this.googleID = "";
        this.email = "";
        this.locale = "";
        this.type = 1;
        this.ui_mode = "adaptable";
        this.userLoaded = false;
        this.userInterfaces = [];
        this.plugins = [];  // Array of {id: string, version: string} e.g. [{id: 'test_plugin', version: '1.0'}]
        this.userInterfaceCollectionID = 0;
        this.uuid = uuid;
        this.webSocketConnection = null;
        this.roles = ['client'];
        let core = require("./../core");
        this.debugMode = core.debugMode;
        this.static = core.static;
        this.staticCSS = core.staticCSS;
        this.loginType = "";
    }

    async loginGoogle(googleID, email, webSocketConnection) {
        let errorMsg = null;
        this.googleID = googleID;
        this.loginType = "google";

        try {
            await this.loginClient(email, webSocketConnection);
        }catch (error){
            errorMsg = error;
        }



        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });

    }

    async loginFacebook(facebookID,email, webSocketConnection) {
        let errorMsg = null;
        this.facebookID = facebookID;
        try {
            await this.loginClient(email, webSocketConnection);
        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });
    }

    async loginAnonym(uuid,email, webSocketConnection) {
        let errorMsg = null;
        this.uuid = uuid;
        this.roles.push("anonym");
        try {
            await this.loginClient(email, webSocketConnection,true);
        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });
    }

    async loginClient(email,webSocketConnection){
        let errorMsg = null;
        try{



            let databaseManager = require("./../database/database-manager");
            let profileBuilder = require("./profile-builder");
            let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", this.email);

            let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);


            if(loadProfileRequestResult.result.length > 0){
                this.id = loadProfileRequestResult.result[0].id;
                this.role = loadProfileRequestResult.result[0].role;
                this.locale = loadProfileRequestResult.result[0].locale;
                this.ui_mode = loadProfileRequestResult.result[0].ui_mode;

                let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", this.id );

                let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

                this.roles = [];

                for(let i=0;i <loadProfileRoleRequestResult.result.length; i++){
                    this.roles.push(loadProfileRoleRequestResult.result[i].role);
                }

                //Add client role to caretakers if they logged in the first time with extension/app
                if(!this.roles.includes("client")){
                    this.roles.push("client");

                    await profileBuilder.saveRoles(this);
                }

                await profileBuilder.loadActiveUserInterfaces(this);
            }else{

                profileBuilder.loadDefaultProfile(this);
                this.isNewProfile = true;
                await profileBuilder.saveProfile(this);


            }
            profileBuilder.createClassMappings(this);

            if(webSocketConnection){
                if(!this.debugMode){
                    profileBuilder.normalizeCSSPaths(this,webSocketConnection.url);
                }
                profileBuilder.normalizeIconPaths(this,webSocketConnection.url);
                profileBuilder.normalizeRemoteAssetDirectoryPaths(this,webSocketConnection.url);
            }



            let core = require("../core");

            let plugin = core.getPlugin("texthelp-analytics", "1.0");
            this.plugins = [plugin.getDefaultConfiguration()];


            this.userLoaded = true;
        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });
    }



    async save(){
        let errorMsg = null;

        try{
            let profileBuilder = require("./profile-builder");
            await profileBuilder.saveProfile(this);

        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });
    }

    async delete(){
        let errorMsg = null;

        try{
            let profileBuilder = require("./profile-builder");
            await profileBuilder.deleteProfile(this);

        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });


    }



    getConfigurationForFunction(req) {

        if (typeof this.userInterfaces[req.ui.uiId].tools[req.ui.toolId].function.configuration !== 'undefined') {

            return this.userInterfaces[req.ui.uiId].tools[req.ui.toolId].function.configuration;
        }

    }

    async logout(){

        if (this.roles.includes("anonym")) {
            let profileBuilder = require("./profile-builder");
            await profileBuilder.deleteProfile(this);
            console.log("Deleting anonym profile complete");
        }

        /*
        if(this.loginType === "Anonym"){
            let profileBuilder = require("./profile-builder");
            await profileBuilder.deleteProfile(this);
            console.log("Deleting anonym profile complete");
        }*/
    }



}
module.exports = Profile;