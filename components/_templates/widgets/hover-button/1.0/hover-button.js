let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class HoverButton extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Hover Button";
        this.description = "A hover button.";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/hover-button.js"];
        this.css = ["widget/hover-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "HoverButton";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.Word.className,
                "name": "Input word",
                "description": "A single word clicked by the user",
            },
        ];

    }



    createTextualDescription(){

        this.textualDescription =[
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","You open Easy Reading."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","You click on the desired tool."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_3","You click on the part of the page where help is needed."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_4","Help is provided only for that part."),
        ]
    }

}

module.exports.class = HoverButton;