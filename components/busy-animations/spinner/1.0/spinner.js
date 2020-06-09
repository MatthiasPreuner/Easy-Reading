let BusyAnimationBase = rootRequire("core/components/busy-animation/base/busy-animation-base");

class Spinner extends BusyAnimationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Spinner";
        this.description = "A simple spinning animation.";
        this.versionDescription = "Initial Version";
        this.scripts = ["animation/spinner.js"];
        this.css = ["animation/spinner.css"];
        this.assetDirectory= "";
        this.implementationClass  = "SpinnerBusyAnimation";

    }

    getConfigurationSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "type": "string",
                    "format": "color",
                    "default": "#000000",
                },
                "fontColor": {
                    "type": "string",
                    "format": "color",
                    "default": "#FFFFFF"
                }
            },

            "required": [
                "backgroundColor",
                "fontColor"
            ]
        };
    }

}

module.exports.class = Spinner;