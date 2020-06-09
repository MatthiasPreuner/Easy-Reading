let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Tooltip extends PresentationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Tooltip";
        this.description = "Renders the result within a tooltip.";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/tooltip.js"];
        this.css = ["presentation/tooltip.css"];
        this.assetDirectory= "";
        this.implementationClass = "Tooltip";
        this.outputTypes = [
            {
                "outputType": ioType.IOTypes.Word.className,
                "name": "Output Word",
                "description": "Word to embed in the tooltip.",
            },
            {
                "outputType": ioType.IOTypes.Sentence.className,
                "name": "Output Sentence",
                "description": "Sentence to embed in the tooltip.",
            },{
                "outputType": ioType.IOTypes.Paragraph.className,
                "name": "Output Paragraph",
                "description": "Paragraph to embed in the tooltip.",
            }
            ];
    }

    getConfigurationSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "type": "string",
                    "format": "color",
                    "default": "#ffffff",
                    "title": "Tooltip color"
                }
            },
            "required": [
                "backgroundColor"
            ]
        };
    }


}

module.exports.class = Tooltip;