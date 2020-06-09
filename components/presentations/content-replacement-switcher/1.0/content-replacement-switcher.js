let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ContentReplacementSwitcher extends PresentationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Content Replacement Switcher Switcher";
        this.description = "Renders the result instead of the paragraph but providing a switch to bring the original back.";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/content-replacement-switcher.js"];
        this.css = ["presentation/content-replacement-switcher.css"];
        this.assetDirectory= "presentation/images";
        this.implementationClass = "ContentReplacementSwitcher";
        this.outputTypes = [
            {
                "outputType": ioType.IOTypes.ContentReplacement.className,
                "name": "Output Paragraph",
                "description": "Switched content",
            }
            ];
    }
}

module.exports.class = ContentReplacementSwitcher;