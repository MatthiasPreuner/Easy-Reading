let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TippyTooltip extends PresentationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "TippyTooltip";
        this.description = "Renders the result within a tooltip based on tippy.";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/popper.min.js","presentation/tippy.min.js","presentation/tippy-tooltip.js"];
        this.css = ["presentation/light-border.css","presentation/tippy-tooltip.css"];
        this.assetDirectory = "presentation/images";
        this.implementationClass = "TippyTooltip";
        this.outputTypes = [
            {
                "outputType": ioType.IOTypes.ImageIOType.className,
                "name": "Output Image",
                "description": "Image to embed in the tooltip.",
            },
            {
                "outputType": ioType.IOTypes.Word.className,
                "name": "Output Word",
                "description": "Word to embed in the tooltip.",
            },
            {
                "outputType": ioType.IOTypes.Sentence.className,
                "name": "Output Sentence",
                "description": "Sentence to embed in the tooltip.",
            }
            /*,{
                "outputType": ioType.IOTypes.Paragraph.className,
                "name": "Output Paragraph",
                "description": "Paragraph to embed in the tooltip.",
            }*/
            ];
    }

}

module.exports.class = TippyTooltip;