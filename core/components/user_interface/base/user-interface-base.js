let ComponentBase = require("./../../base/component-base");

class UserInterfaceBase extends ComponentBase{
    constructor(baseDir){
        super(baseDir);
        this.componentID = "user-interface";
        this.name = "UserInterfaceBase";
        this.description = "UserInterfaceBase description";
        this.componentCategory = "user-interface";


    }

    getDefaultConfiguration(){
        let defaultConfiguration = super.getDefaultConfiguration();
        defaultConfiguration.tools = [];
        return defaultConfiguration;
    }


    getToolLayoutConfigurationSchema() {
        return {}
    }

    hasLayoutConfigurationSchema(){
        return Object.keys(this.getToolLayoutConfigurationSchema() ).length !== 0;
    }

    getDefaultToolLayoutConfiguration() {
        let defaults = require('json-schema-defaults');
        return defaults(this.getToolLayoutConfigurationSchema());
    }

    async createLayoutConfigTable(tableName){

        let errorMsg = null;
        try{
            let schema = this.getToolLayoutConfigurationSchema();
            if(Object.keys(schema).length !== 0 && schema.constructor === Object){
                let databaseManager = require("./../../../database/database-manager");
                await databaseManager.createOrSyncTablesFromSchema(schema,tableName);

            }
        }catch (error){
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


}

module.exports = UserInterfaceBase;