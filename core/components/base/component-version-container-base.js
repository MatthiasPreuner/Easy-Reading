class ComponentVersionContainer{
    constructor(id){
        this.id = id;
        this.versions = [];
    }


    addVersion(versionID, version){
        version.versionID = versionID;
        this.versions.push({
            id : versionID,
            version : version,
        });


    }

    versionCount(){
        return this.versions.length;
    }



}

module.exports = ComponentVersionContainer;