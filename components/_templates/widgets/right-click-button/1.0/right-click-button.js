let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class RightClickButton extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Right Click Button";
        this.description = "A button that works with right click";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/right-click-button.js"];
        this.css = ["widget/right-click-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "RightClickButton";
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.VoidIOType.className,
                "name": "Void",
                "description": "This widget does not accept any input.",
            }
        ];

    }

}

module.exports.class = RightClickButton;