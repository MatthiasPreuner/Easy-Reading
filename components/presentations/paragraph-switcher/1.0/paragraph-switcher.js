let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ParagraphSwitcher extends PresentationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Paragraph Switcher";
        this.description = "Renders the result instead of the paragraph but providing a switch to bring the original back.";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/paragraph-switcher.js"];
        this.css = ["presentation/paragraph-switcher.css"];
        this.assetDirectory= "presentation/images";
        this.implementationClass = "ParagraphSwitcher";
        this.outputTypes = [
            {
            "outputType": ioType.IOTypes.Paragraph.className,
            "name": "Output Paragraph",
            "description": "Switched paragraph",
            },
            {
                "outputType": ioType.IOTypes.ParsedLanguageType.className,
                "name": "Output Paragraph",
                "description": "Output Paragraph with syntactic metadata",
            }];
    }
}

module.exports.class = ParagraphSwitcher;