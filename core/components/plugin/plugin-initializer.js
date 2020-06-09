let ComponentInitializer = require("./../base/component-initializer");

class PluginInitializer extends ComponentInitializer {
    constructor(debugMode){
        super(debugMode);
        this.pathToComponentsDir = "components/plugins/";
        this.pathToContainerFile = "core/components/plugin/base/plugin-version-container.js";
    }
}

module.exports = PluginInitializer;
