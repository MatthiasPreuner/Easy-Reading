let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Button extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Auto Button";
        this.description = "A button that can automatically trigger on pageload";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/auto-button.js"];
        this.css = ["widget/auto-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "AutoButton";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.URLType.className,
                "name": "Page URL",
                "description": "The current page url.",
            }
        ];

    }


}

module.exports.class = Button;