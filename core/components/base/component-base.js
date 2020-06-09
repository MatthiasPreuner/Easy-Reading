"use strict";
class ComponentBase {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.id = "";
        this.version = "";
        this.contentScripts = [];
        this.contentCSS = [];
        this.remoteScripts = [];
        this.remoteCSS = [];
        this.remoteAssetDirectory = "";
        this.componentCategory = "";
        this.iconsForSchemaProperties = [];
        //Can be overwritten by subClasses

        this.debugMode = false;
        this.name = "";
        this.description = "";
        this.versionDescription = "";
        this.scripts = [];
        this.css = [];
        this.assetDirectory = "";
        this.implementationClass = "";
        this.textualDescription = [];
        this.descriptionManager = require("../util/description/descriptionManager");

    }


    loadSources() {
        let fs = require('fs');
        if (this.assetDirectory !== "") {
            let pathToAssetDir = require("path").join(this.baseDir, this.assetDirectory);
            let stat = fs.statSync(pathToAssetDir);
            if (stat && stat.isDirectory()) {
                this.remoteAssetDirectory = this.copyToWeb(this.assetDirectory);
            } else {
                console.log("Asset Directory not found:" + this.assetDirectory);
            }
        }

        for (let i = 0; i < this.scripts.length; i++) {
            let pathToJavaScriptFile = require("path").join(this.baseDir, this.scripts[i]);
            if (!fs.existsSync(pathToJavaScriptFile)) {
                console.log("File not found:" + this.scripts[i]);
            } else {

                if (this.debugMode) {
                    let scriptURL = this.copyToWeb(this.scripts[i]);
                    this.remoteScripts.push(scriptURL);
                } else {
                    this.contentScripts.push(
                        {
                            id: this.scripts[i],
                            source: btoa(fs.readFileSync(pathToJavaScriptFile, "utf8")),
                        }
                    );

                }
            }
        }

        for (let i = 0; i < this.css.length; i++) {
            let pathToStyleSheet = require("path").join(this.baseDir, this.css[i]);
            if (!fs.existsSync(pathToStyleSheet)) {
                console.log("File not found:" + this.css[i]);
            } else {

                if (this.debugMode) {
                    let styleSheetURL = this.copyToWeb(this.css[i]);
                    this.remoteCSS.push(styleSheetURL);
                } else {
                    this.contentCSS.push(
                        {
                            id: this.css[i],
                            css: btoa(fs.readFileSync(pathToStyleSheet)),
                        }
                    );
                }
            }
        }

    }
    getConfigurationSchema(){
        return {

        };
    }

    hasConfigurationSchema(){
        return Object.keys(this.getConfigurationSchema() ).length !== 0;
    }

    getDefaultConfiguration(){
        let defaults = require('json-schema-defaults');
        return {
            "source": this.getComponentInformation(),
            "configuration": defaults(this.getConfigurationSchema()),
        };
    }

    getConfiguration(configuration){
        return {
            "source": this.getComponentInformation(),
            "configuration": configuration,
        };

    }

    getComponentInformation() {

        let componentInformation = {
            "id": this.id,
            "name" : this.name,
            "description" : this.description,
            "version" : this.version,
            "versionDescription" : this.versionDescription,
            "debugMode": this.debugMode,
            "remoteAssetDirectory" : this.remoteAssetDirectory,
            "remoteBaseDirectory" : "components/" + this.componentCategory + "/" + this.id + '/' + this.version + '/',
            "implementationClass" : this.implementationClass,
        };

        if(this.debugMode){

            componentInformation.remoteScripts = this.remoteScripts;
            componentInformation.remoteCSS = this.remoteCSS;
        }else{

            //Clone of script and css are made
            componentInformation.contentScripts = [];
            for(let i=0; i < this.contentScripts.length; i++){
                componentInformation.contentScripts.push(Object.assign({}, this.contentScripts[i]));

            }

            componentInformation.contentCSS = [];
            for(let i=0; i < this.contentCSS.length; i++){
                componentInformation.contentCSS.push(Object.assign({}, this.contentCSS[i]));

            }
        }

        return componentInformation;
    }


    copyToWeb(pathOfFileOrDir) {

        try {
            const fs = require('fs-extra');
            fs.copySync(require("path").join(this.baseDir, pathOfFileOrDir), baseDirPath("public/components/" + this.componentID + "/" + this.id + '/' + this.version + '/' + pathOfFileOrDir));

            return "/components/" + this.componentCategory + "/" + this.id + '/' + this.version + '/' + pathOfFileOrDir;
        } catch (err) {
            console.error(err)
        }


    }

    async createConfigTable(tableName){

        let errorMsg = null;

        try{
            let schema = this.getConfigurationSchema();
            if(Object.keys(schema).length !== 0 && schema.constructor === Object){
                let databaseManager = require("./../../database/database-manager");
                await databaseManager.createOrSyncTablesFromSchema(schema,tableName);

            }
        }catch(error){
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });


    }

    createTextualDescription(){

    }

    createIconForSchemaProperty(schemaProperty,iconPath,cssClass = null) {

        this.iconsForSchemaProperties.push({
            type:"propertyIcon",
            property: schemaProperty,
            url: this.copyToWeb(iconPath),
            cssClass:cssClass,
        })

    }

    createIconForSchemaPropertyValue(schemaProperty,value,iconPath,cssClass = null) {
        this.iconsForSchemaProperties.push({
            type:"propertyValueIcon",
            property: schemaProperty,
            value: value,
            url: this.copyToWeb(iconPath),
            cssClass:cssClass,
        })
    }

    createIconsForSchemaProperties(){

    }
}

module.exports = ComponentBase;