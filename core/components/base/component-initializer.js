class ComponentInitializer {
    constructor(debugMode) {

        this.debugMode = debugMode;
        this.components = [];
        this.pathToComponentsDir = "";
        this.pathToContainerFile = "";

    }

    initComponents() {
        let componentsDir = baseDirPath(this.pathToComponentsDir);
        let pathToContainerFile = this.pathToContainerFile;
        let componentInitializer = this;
        let fs = require('fs');
        fs.readdirSync(componentsDir).forEach(function(component) {

            let componentDir = componentsDir + '/' + component;
            let stat = fs.statSync(componentDir);
            let componentContainer = rootRequire(pathToContainerFile);
            let currentComponentContainer = new componentContainer(component);


            if (stat && stat.isDirectory()) {

                fs.readdirSync(componentDir).forEach(function(version) {
                    let versionDir = componentDir + '/' + version;
                    let stat = fs.statSync(versionDir);

                    if (stat && stat.isDirectory()) {

                        if (fs.existsSync(versionDir+"/"+component+".js")) {
                            let uiStat = fs.statSync(versionDir+"/"+component+".js");
                            if(uiStat.isFile()){

                                let componentClass = require(versionDir+"/"+component);
                                let newComponent = new componentClass.class(versionDir);
                                newComponent.id = component;
                                newComponent.version = version;
                                newComponent.debugMode = componentInitializer.debugMode;
                                newComponent.loadSources();
                                newComponent.createTextualDescription();
                                newComponent.createIconsForSchemaProperties();

                                currentComponentContainer.addVersion(version,newComponent);

                            }
                        }else{
                            console.log("ERROR");
                        }
                    }

                });

                if(currentComponentContainer.versionCount() > 0){
                    componentInitializer.components.push(currentComponentContainer);
                }else{
                    console.log("No versions detected!");
                }
            }
        });



    }
    async createComponentTables(){
        let errorMsg = null;
        try {
            let componentInitializer = this;
            let databaseManager = require("./../../database/database-manager");
            for (let i = 0; i < componentInitializer.components.length; i++) {
                for (let j = 0; j < componentInitializer.components[i].versions.length; j++) {
                    let currentComponent = componentInitializer.components[i].versions[j].version;
                    await currentComponent.createConfigTable(databaseManager.getConfigTableNameForComponent(currentComponent));
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

module.exports  = ComponentInitializer;