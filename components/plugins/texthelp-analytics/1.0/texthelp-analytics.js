let PluginBase = rootRequire("core/components/plugin/base/plugin-base");

class TexthelpAnalytics extends PluginBase {
    constructor(baseDir){
        super(baseDir);
        this.name = "Texthelp analytics";
        this.description = "Google Analytics of Texthelp";
        this.versionDescription = "Initial Version";
        this.scripts = ["plugin/assets/js/analytics.js"];
        this.assetDirectory= "";
        this.implementationClass = "TestPlugin";
    }

    getConfigurationSchema() {
        return {};
    }
}

module.exports.class = TexthelpAnalytics;
