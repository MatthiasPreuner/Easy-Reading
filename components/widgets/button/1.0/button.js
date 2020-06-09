let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Button extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Simple Button";
        this.description = "A simple button.";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/button.js"];
        this.css = ["widget/button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "Button";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.VoidIOType.className,
                "name": "Void",
                "description": "This widget does not accept any input.",
            }
        ];

    }

}

module.exports.class = Button;