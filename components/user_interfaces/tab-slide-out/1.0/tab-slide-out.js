let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class TabSlideOutUserInterface extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "TabSlideOut";
        this.description = "Simple tab slide out";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/jquery-ui.js", "ui/erTabSlideOut.js", "ui/tab-slide-out-ui.js", "ui/imagesloaded.pkgd.js", "ui/erMobileToolTips.js"];
        this.css = ["ui/jquery-ui.css", "ui/tab-slide-out-ui.css", "ui/erTabSlideOut.css", "ui/erMobileToolTips.css"];
        this.assetDirectory = "ui/images";
        this.implementationClass = "TabSlideOutUserInterface";
        this.supportCategories = ["slide_in"];


    }

    getConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "tabPositioning": {
                    "type": "string",
                    "title": "Position on the screen where the tab will appear: left, right, top, or bottom",
                    "default": 'right',
                    "enum": ["top", "right", "bottom","left"],
                },
                "buttonSize": {
                    "type": "integer",
                    "title" : "Button Size",
                    "description": "Size of buttons in pixels",
                    "default": 80,
                    "minimum": 50,
                    "maximum": 150,
                }
            }
        }
    }

    createIconsForSchemaProperties(){
        this.createIconForSchemaProperty("buttonSize","assets/button_size.png","radio_button_icon");

    }
}

module.exports.class = TabSlideOutUserInterface;