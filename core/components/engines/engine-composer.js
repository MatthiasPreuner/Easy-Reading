let engineContainer = require("./base/engine-container");


let engineComposer = {
    debugMode: false,
    engines: [],
    createEngines: function () {

        let enginesDir = require("path").join(__dirname, "../../../components/engines");
        let fs = require('fs');
        fs.readdirSync(enginesDir).forEach(function (engine) {

            let engineDir = enginesDir + '/' + engine;
            let stat = fs.statSync(engineDir);
            let currentEngineContainer = new engineContainer.EngineContainer(engine);

            if (stat && stat.isDirectory()) {
                fs.readdirSync(engineDir).forEach(function (version) {
                    let versionDir = engineDir + '/' + version;
                    let stat = fs.statSync(versionDir);

                    if (stat && stat.isDirectory()) {

                        if (fs.existsSync(versionDir + "/engine.js")) {
                            let engineStat = fs.statSync(versionDir + "/engine.js");
                            if (engineStat.isFile()) {

                                let engineClass = require(versionDir + "/engine");
                                let newEngine = new engineClass.class();
                                newEngine.id = engine;
                                newEngine.version = version;
                                newEngine.debugMode = engineComposer.debugMode;
                                newEngine.createFunctions(versionDir);
                                newEngine.credentialManager = require("../../util/credential-manager");
                                newEngine.authManager = require("../../authentication/authmanager");
                                newEngine.createTextualDescription();
                                newEngine.createIconsForSchemaProperties();
                                currentEngineContainer.addVersion(version, newEngine);
                            }
                        } else {
                            console.log("ERROR - Engine.js for engine '" + engine + "' not found.");
                        }
                    }

                });

                if (currentEngineContainer.versionCount() > 0) {
                    engineComposer.engines.push(currentEngineContainer);
                } else {
                    console.log("No versions detected!");
                }
            }
        });


        //   engineComposer.testEngines();

    },
    createEngineFunctions() {
        for (let i = 0; i < engineComposer.engines.length; i++) {
            for (let j = 0; j < engineComposer.engines[i].versions.length; j++) {
                engineComposer.engines[i].versions[j].engine.createFunctions();
            }
        }
    },

    async createEngineTables() {

        let errorMsg = null;
        try {
            let databaseManger = require("../../database/database-manager");
            for (let i = 0; i < engineComposer.engines.length; i++) {
                for (let j = 0; j < engineComposer.engines[i].versions.length; j++) {
                    await engineComposer.engines[i].versions[j].engine.createConfigTable(databaseManger.getConfigTableNameForEngine(engineComposer.engines[i].versions[j].engine));
                }
            }
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, resign) {

            if(errorMsg){
                resign(errorMsg);
            }else {
                resolve();
            }
        });
    },

    testEngines() {
        for (let i = 0; i < engineComposer.engines.length; i++) {
            for (let j = 0; j < engineComposer.engines[i].versions.length; j++) {
                for (let k = 0; k < engineComposer.engines[i].versions[j].engine.functions.length; k++) {


                    console.log(engineComposer.engines[i].versions[j].engine.getDefaultData());

                    if (engineComposer.engines[i].versions[j].engine.functions[k].type === "RemoteFunction") {

                        let func = engineComposer.engines[i].versions[j].engine.functions[k].entryPoint;
                        let object = engineComposer.engines[i].versions[j].engine;
                        object[func]();

                    }


                }
            }

        }

    }

};


module.exports = engineComposer;