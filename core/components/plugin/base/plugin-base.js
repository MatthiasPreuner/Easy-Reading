let ComponentBase = require("./../../base/component-base");

class PluginBase extends  ComponentBase {
    constructor(baseDir){
        super(baseDir);
        this.componentID = "plugin";
        this.name = "BasePlugin";
        this.description = "Base Plugin class";
        this.implementationClass = "PluginImplementation";
        this.componentCategory = "plugin";
    }
}

module.exports = PluginBase;
