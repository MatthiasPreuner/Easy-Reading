let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ContinuousChoiceButton extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Continuous Choice Button";
        this.description = "A simple button.";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/continuous-choice-button.js"];
        this.css = ["widget/continuous-choice-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "ContinuousChoiceButton";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.Paragraph.className,
                "name": "Input paragraph",
                "description": "A paragraph of text clicked by the user",
            }
        ];
    }

    /*
    getConfigurationSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColorButtonActive": {
                    "type": "string",
                    "format": "color",
                    "default": "#ffffff",
                    "title": "Active button background color"
                }
            },
            "required": [
                "backgroundColorButtonActive"
            ]
        };
    }
    */

    createTextualDescription(){

        this.textualDescription =[
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","You open Easy Reading."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","You click on the desired tool."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_3","You click on the part of the page where help is needed."),
            this.descriptionManager.createOrderedListItemEntry(this,"instruction_4","Help is provided for the rest of the page."),

        ]
    }

}

module.exports.class = ContinuousChoiceButton;