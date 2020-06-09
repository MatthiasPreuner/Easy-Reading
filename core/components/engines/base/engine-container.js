class EngineContainer{
    constructor(id){
        this.engine = id;
        this.versions = [];
    }


    addVersion(versionID, engine){
        engine.version = versionID;
        this.versions.push({
            version : versionID,
            engine : engine
        });


    }

    versionCount(){
        return this.versions.length;
    }



}

module.exports.EngineContainer = EngineContainer;