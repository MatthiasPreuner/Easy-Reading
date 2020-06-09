let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TwoStateButton extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Two state button";
        this.description = "A simple two state button.";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/two-state-button.js"];
        this.css = ["widget/two-state-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "TwoStateButton";
        this.debugMode = false;
        this.states = 2;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.VoidIOType.className,
                "name": "Void",
                "description": "This widget does not accept any input.",
            }
        ];

    }

}

module.exports.class = TwoStateButton;