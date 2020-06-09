let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AnnotatedParagraphSwitcher extends PresentationBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Annotated Paragraph Tooltip Renderer";
        this.description = "Renders the result instead of the paragraph but providing a switch to bring the original back.";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/popper.min.js","presentation/tippy.min.js","presentation/annotated-paragraph-switcher.js"];
        this.css = ["presentation/light-border.css","presentation/annotated-paragraph-switcher.css"];
        this.assetDirectory= "presentation/images";
        this.implementationClass = "AnnotatedParagraphSwitcher";
        this.outputTypes = [
            {
                "outputType": ioType.IOTypes.ParsedLanguageType.className,
                "name": "Output Paragraph",
                "description": "Output Paragraph with syntactic metadata",
            }];
    }
}

module.exports.class = AnnotatedParagraphSwitcher;