let ComponentInitializer = require("./../base/component-initializer");

class UserInterfaceInitializer extends ComponentInitializer{
    constructor(debugMode){
        super(debugMode);
        this.pathToComponentsDir = "components/user_interfaces/";
        this.pathToContainerFile = "core/components/user_interface/base/user-interface-version-container.js";
    }

    async createComponentTables(){

        let errorMsg = null;

        try {
            await super.createComponentTables();
            let userInterfaceInitializer = this;

            let databaseManager = require("./../../database/database-manager");
            for (let i = 0; i < userInterfaceInitializer.components.length; i++) {
                for (let j = 0; j < userInterfaceInitializer.components[i].versions.length; j++) {
                    let currentComponent = userInterfaceInitializer.components[i].versions[j].version;
                    await currentComponent.createLayoutConfigTable(databaseManager.getConfigTableNameForLayout(currentComponent));
                }
            }
        }catch(error){
            errorMsg = error;
        }
        return new Promise(function (resolve,resign) {

            if(errorMsg){
                resign(errorMsg);
            }else{
                resolve();
            }

        });
    }




}

module.exports = UserInterfaceInitializer;