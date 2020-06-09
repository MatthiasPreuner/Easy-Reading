let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextSelector extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Text Selector";
        this.description = "Allows to user to select text";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/text-selector.js"];
        this.css = ["widget/text-selector.css"];
        this.assetDirectory= "";
        this.implementationClass = "TextSelector";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.Paragraph.className,
                "name": "Input paragraph",
                "description": "A paragraph of text selected by the user",
            }
        ];

    }

    createTextualDescription(){

        this.textualDescription =[
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","You mark the part of the page with the mouse where help is needed."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","You open Easy Reading."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_3","You click on the desired tool."),
        ]
    }

}

module.exports.class = TextSelector;