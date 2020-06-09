let PluginBase = rootRequire("core/components/plugin/base/plugin-base");

class TestPlugin extends PluginBase {
    constructor(baseDir){
        super(baseDir);
        this.name = "TestPlugin";
        this.description = "Injects test JS and CSS";
        this.versionDescription = "Initial Version";
        this.scripts = ["plugin/assets/js/test_js.js"];
        this.css = ["plugin/assets/css/test_css.css"];
        this.assetDirectory= "";
        this.implementationClass = "TestPlugin";
    }

    getConfigurationSchema() {
        return {};
    }
}

module.exports.class = TestPlugin;
