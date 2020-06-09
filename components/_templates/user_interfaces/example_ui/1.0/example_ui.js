let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class ExampleUI extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "Example UI";
        this.description = "Some description here...";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/example_ui.js"];
        this.css = ["ui/example_ui.css"];
        this.implementationClass = "ExampleUIImplementation";
        this.supportCategories = [];
    }

    getConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "type": "string",
                    "title": "Background Color",
                    "default": 'yellow',
                    "enum": ["green", "yellow", "blue"],
                }
            }
        }
    }

}

module.exports.class = ExampleUI;