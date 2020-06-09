let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ScreenRuler extends base.EngineBase{
    constructor() {
        super();
        this.id = "ScreenRuler";
        this.name = "Screen Ruler";
        this.description = "Creates a screenruler for better reading";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getFunctions(){
        return [
            {
                id : "screen-ruler",
                name: "Screen ruler",
                description : "Creates a screenruler for better reading",
                defaultIcon : "assets/screen-ruler.png",
                states: 2,
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/screen-ruler.js'],
                styleSheets : ['/css/screen-ruler.css'],
                toolCategory: base.EngineFunction.ToolCategories.Reading,
                entryPoint: "easyReadingScreenRuler",
            }

        ];
    }

    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "screen-ruler",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"intro_text","Instruction:"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","Turn on the screen ruler"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","A line in the text will be brighter, like a ruler."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_3","You can move the ruler up and down."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_4","Click again on the ruler."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_5","The ruler disappears again."),

                ]
            }

        ];
    }
}

module.exports.class = ScreenRuler;